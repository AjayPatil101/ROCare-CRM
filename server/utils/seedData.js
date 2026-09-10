/**
 * Seeds the database with the same demo data that shipped in the original
 * static HTML dashboard, so the app looks populated on first run.
 * Usage: npm run seed
 */
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import Service from "../models/Service.js";
import Payment from "../models/Payment.js";

dotenv.config();

const run = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany(),
    Customer.deleteMany(),
    Service.deleteMany(),
    Payment.deleteMany(),
  ]);

  const admin = await User.create({
    name: "Amit Kumar",
    email: "admin@roservice.com",
    password: "password123",
    role: "admin",
  });

  const customerData = [
    { name: "Rajesh Sharma", phone: "9876543210", address: "123, Shakti Nagar, Jaipur", brand: "Kent Grand Plus", installDate: "2024-02-20", lastServiceDate: "2024-02-20", nextDueDate: "2024-05-20", notes: "All filters checked and cleaned." },
    { name: "Sunita Verma", phone: "9123456780", address: "56, Gopal Pura, Jaipur", brand: "Aquaguard", installDate: "2024-02-21", lastServiceDate: "2024-02-21", nextDueDate: "2024-05-21" },
    { name: "Amit Patel", phone: "9899989998", address: "78, Malviya Nagar, Jaipur", brand: "Pureit", installDate: "2024-02-22", lastServiceDate: "2024-02-22", nextDueDate: "2024-05-22" },
    { name: "Neha Singh", phone: "7901234567", address: "24, Mansarovar, Jaipur", brand: "Livpure", installDate: "2024-02-24", lastServiceDate: "2024-02-24", nextDueDate: "2024-05-24" },
    { name: "Vikram Mehta", phone: "7600001111", address: "11, Vaishali Nagar, Jaipur", brand: "Kent", installDate: "2024-02-25", lastServiceDate: "2024-02-25", nextDueDate: "2024-05-25" },
  ];

  const customers = await Customer.insertMany(
    customerData.map((c) => ({ ...c, createdBy: admin._id }))
  );

  const services = [
    { customer: customers[0]._id, type: "General Service", date: "2024-02-20", amount: 600, nextDue: "2024-05-20", notes: "All filters checked and cleaned." },
    { customer: customers[1]._id, type: "Filter Change", date: "2024-02-21", amount: 800, nextDue: "2024-05-21" },
    { customer: customers[2]._id, type: "General Service", date: "2024-02-22", amount: 600, nextDue: "2024-05-22" },
  ];
  const createdServices = await Service.insertMany(
    services.map((s) => ({ ...s, createdBy: admin._id }))
  );

  await Payment.insertMany([
    { customer: customers[0]._id, service: createdServices[0]._id, date: "2024-02-20", amount: 600, status: "Paid" },
    { customer: customers[1]._id, service: createdServices[1]._id, date: "2024-05-21", amount: 600, status: "Pending" },
    { customer: customers[2]._id, service: createdServices[2]._id, date: "2024-05-22", amount: 800, status: "Pending" },
  ]);

  console.log("Seed complete. Admin login -> admin@roservice.com / password123");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
