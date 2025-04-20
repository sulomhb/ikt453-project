// routes/postgres.ts
import { Router } from 'express';
import { selectPostgreSQL } from '../../api/postgresql/select_postgresql.ts';

const router = Router();

router.get('/analytics', async (req, res) => {
  try {    
    const result = await selectPostgreSQL();

    res.status(200).json({
      status: 'Success',
      data: result.rows
    });
  } catch (err) {
    console.error('PostgreSQL error:', err);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch analytics'
    });
  }
});

export default router;