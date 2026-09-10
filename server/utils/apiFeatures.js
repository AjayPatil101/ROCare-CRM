/**
 * Small reusable helper for search + pagination + sorting on Mongoose queries.
 * Keeps controllers thin and consistent across resources.
 */
export class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = new RegExp(this.queryString.search, "i");
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }

  filter(allowedFilters = []) {
    const filters = {};
    allowedFilters.forEach((key) => {
      if (this.queryString[key]) filters[key] = this.queryString[key];
    });
    if (Object.keys(filters).length) this.query = this.query.find(filters);
    return this;
  }

  sort(defaultSort = "-createdAt") {
    const sortBy = this.queryString.sort
      ? this.queryString.sort.split(",").join(" ")
      : defaultSort;
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.min(parseInt(this.queryString.limit, 10) || 10, 100);
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    this.pagination = { page, limit };
    return this;
  }
}
