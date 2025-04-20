// routes/mongodb.ts
import { Router } from 'express';
import { selectMongoDB } from '../../api/mongodb/select_mongodb.ts';

const router = Router();

router.get('/clinical', async (req, res) => {
  try {
    const data = await selectMongoDB();
    res.status(200).json({
      status: 'Success',
      data: data
    });
  } catch (err) {
    console.error('MongoDB error:', err);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch clinical data'
    });
  }
});

export default router;