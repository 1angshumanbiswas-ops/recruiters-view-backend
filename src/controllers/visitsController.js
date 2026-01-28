const Visit = require("../models/Visit");

// Helper to calculate date range
function getStartDate(period) {
  const now = new Date();
  switch (period) {
    case "week":
      return new Date(now.setDate(now.getDate() - 7));
    case "month":
      return new Date(now.setMonth(now.getMonth() - 1));
    case "quarter":
      return new Date(now.setMonth(now.getMonth() - 3));
    default:
      return new Date(now.setDate(now.getDate() - 7));
  }
}

// GET /api/recruiters/visits?period=week|month|quarter
exports.getRecruiterVisits = async (req, res) => {
  const { period = "week" } = req.query;
  const startDate = getStartDate(period);

  try {
    const visits = await Visit.aggregate([
      { $match: { timestamp: { $gte: startDate } } },
      {
        $group: {
          _id: "$recruiterEmail",
          count: { $sum: 1 },
          company: { $first: "$company" }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ period, visits });
  } catch (err) {
    console.error("❌ Visit analytics error:", err);
    res.status(500).json({ error: "Failed to fetch visit analytics" });
  }
};