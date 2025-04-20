// routes/redis.ts
import { Router } from 'express';
import { selectRedis } from '../../api/redis/select_redis.ts';

const router = Router();

router.get('/cache', async (req, res) => {
  try {
    const { key } = req.query;
    const cachedData = await selectRedis();
    
    res.status(200).json({
      status: 'Success',
      data: cachedData
    });
  } catch (err) {
    console.error('Redis error:', err);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to access cache'
    });
  }
});

export default router;