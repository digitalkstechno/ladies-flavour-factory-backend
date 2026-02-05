const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const Catalog = require('../models/catalogModel');
const StockTransaction = require('../models/stockTransactionModel');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const last7DaysStart = new Date();
  last7DaysStart.setDate(todayStart.getDate() - 6);
  last7DaysStart.setHours(0, 0, 0, 0);

  // Filter for stock transactions based on role
  const stockQuery = {};
  if (req.user.role && req.user.role.name !== 'Admin') {
    stockQuery.user = req.user._id;
  }

  // Parallel Execution
  const [
    totalProducts,
    totalCatalogs,
    todayInCount,
    todayOutCount,
    recentTransactions,
    chartDataRaw
  ] = await Promise.all([
    // 1. Total Products
    Product.countDocuments({}),

    // 2. Total Catalogs
    Catalog.countDocuments({}),

    // 3. Today's In (Transaction Count)
    StockTransaction.countDocuments({
      ...stockQuery,
      type: 'IN',
      createdAt: { $gte: todayStart, $lte: todayEnd }
    }),

    // 4. Today's Out (Transaction Count)
    StockTransaction.countDocuments({
      ...stockQuery,
      type: 'OUT',
      createdAt: { $gte: todayStart, $lte: todayEnd }
    }),

    // 5. Recent Transactions (Limit 5)
    StockTransaction.find({ ...stockQuery })
      .populate({
        path: 'product',
        select: 'name sku catalog',
        populate: {
          path: 'catalog',
          select: 'name'
        }
      })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),

    // 6. Chart Data (Last 7 Days - Sum of Quantities)
    StockTransaction.aggregate([
      {
        $match: {
          ...stockQuery,
          createdAt: { $gte: last7DaysStart, $lte: todayEnd }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            type: "$type"
          },
          totalQuantity: { $sum: "$quantity" }
        }
      },
      {
        $sort: { "_id.date": 1 }
      }
    ])
  ]);

  // Process Chart Data
  const chartMap = new Map();
  // Initialize map with last 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(todayEnd.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isoDate = d.toISOString().split('T')[0]; // Key to match aggregation
    chartMap.set(isoDate, { name: dateStr, in: 0, out: 0 });
  }

  // Fill in data from aggregation
  chartDataRaw.forEach(item => {
    const dateKey = item._id.date;
    // We need to match the dateKey to our map keys. 
    // The loop above generates keys based on "today" backwards.
    // Let's verify if map keys match item._id.date (YYYY-MM-DD)
    
    // Actually, simpler approach for the map:
    // We need to return an array [{name: 'Mon', in: 10, out: 5}, ...]
    // ordered from 7 days ago to today.
  });

  // Re-doing chart processing to be robust
  const processedChartData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(todayStart.getDate() - i);
    const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const inData = chartDataRaw.find(x => x._id.date === dateStr && x._id.type === 'IN');
    const outData = chartDataRaw.find(x => x._id.date === dateStr && x._id.type === 'OUT');

    processedChartData.push({
      name: dayName,
      in: inData ? inData.totalQuantity : 0,
      out: outData ? outData.totalQuantity : 0
    });
  }

  res.json({
    counts: {
      products: totalProducts,
      catalogs: totalCatalogs,
      todayIn: todayInCount,
      todayOut: todayOutCount
    },
    recentTransactions,
    chartData: processedChartData
  });
});

module.exports = {
  getDashboardStats
};
