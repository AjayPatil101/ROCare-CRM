import asyncHandler from "../middleware/asyncHandler.js";
import Customer from "../models/Customer.js";
import Service from "../models/Service.js";
import Payment from "../models/Payment.js";

// @desc    Aggregated stats for the dashboard cards, donut chart & earnings graph
// @route   GET /api/dashboard/stats
// @access  Private
export const getDashboardStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekEnd = new Date(startOfToday);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const monthEnd = new Date(startOfToday);
  monthEnd.setDate(monthEnd.getDate() + 30);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalCustomers,
    newThisMonth,
    dueToday,
    dueThisWeek,
    dueThisMonth,
    pendingAgg,
    earningsAgg,
    upcoming,
    totalServices,
  ] = await Promise.all([
    Customer.countDocuments(),
    Customer.countDocuments({ createdAt: { $gte: startOfMonth } }),
    Customer.countDocuments({ nextDueDate: { $gte: startOfToday, $lt: new Date(startOfToday.getTime() + 86400000) } }),
    Customer.countDocuments({ nextDueDate: { $gte: startOfToday, $lte: weekEnd } }),
    Customer.countDocuments({ nextDueDate: { $gte: startOfToday, $lte: monthEnd } }),
    Payment.aggregate([{ $match: { status: "Pending" } }, { $group: { _id: null, total: { $sum: "$amount" }, count: { $sum: 1 } } }]),
    Payment.aggregate([
      { $match: { status: "Paid", date: { $gte: startOfMonth } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Customer.find().sort("nextDueDate").limit(5),
    Service.countDocuments(),
  ]);

  const notDue = Math.max(totalCustomers - dueThisMonth, 0);

  res.json({
    success: true,
    data: {
      totalCustomers,
      newThisMonth,
      upcomingServices: dueThisWeek,
      pendingPayments: pendingAgg[0]?.total || 0,
      pendingCount: pendingAgg[0]?.count || 0,
      totalEarningsThisMonth: earningsAgg[0]?.total || 0,
      totalServices,
      reminderOverview: { dueToday, dueThisWeek, dueThisMonth, notDue },
      upcomingCustomers: upcoming,
    },
  });
});

// @desc    Earnings time-series for the Reports page chart
// @route   GET /api/dashboard/earnings-report
// @access  Private
export const getEarningsReport = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 30;
  const since = new Date();
  since.setDate(since.getDate() - days);

  const series = await Payment.aggregate([
    { $match: { status: "Paid", date: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({ success: true, data: series });
});
