import express from 'express';
import AiLog from '../models/AiLog.js';
import { protect as requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Only allow in development mode or if explicitly enabled
const requireDev = (req, res, next) => {
  if (process.env.NODE_ENV !== 'development') {
    return res.status(403).json({ error: 'Access denied. Developer dashboard is only available in development mode.' });
  }
  next();
};

// GET /api/v1/admin/ai-usage
router.get('/ai-usage', requireAuth, requireDev, async (req, res) => {
  try {
    const logs = await AiLog.find().sort({ timestamp: -1 }).limit(100);
    
    // Aggregate metrics
    const stats = await AiLog.aggregate([
      {
        $group: {
          _id: null,
          totalRequests: { $sum: 1 },
          totalEstimatedCost: { $sum: '$estimatedCostUSD' },
          totalTokens: { $sum: '$totalTokens' },
          averageLatency: { $avg: '$latencyMs' },
          cacheHits: {
            $sum: { $cond: ['$cacheHit', 1, 0] }
          },
          errors: {
            $sum: { $cond: ['$success', 0, 1] }
          }
        }
      }
    ]);

    // Group by feature
    const features = await AiLog.aggregate([
      {
        $group: {
          _id: '$featureName',
          requests: { $sum: 1 },
          cost: { $sum: '$estimatedCostUSD' },
          avgLatency: { $avg: '$latencyMs' }
        }
      },
      { $sort: { cost: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        recentLogs: logs,
        stats: stats[0] || {
          totalRequests: 0,
          totalEstimatedCost: 0,
          totalTokens: 0,
          averageLatency: 0,
          cacheHits: 0,
          errors: 0
        },
        features
      }
    });
  } catch (err) {
    console.error('Failed to fetch AI usage:', err);
    res.status(500).json({ error: 'Failed to fetch AI usage metrics' });
  }
});

export default router;
