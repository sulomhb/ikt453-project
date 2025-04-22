// routes/postgres.ts
import { Router } from 'express';
import { selectPostgreSQL } from '../../api/postgresql/select_postgresql.ts';
import { insertPostgreSQL } from '../../api/postgresql/insert_postgresql.ts';
import { updatePostgreSQL } from '../../api/postgresql/update_postgresql.ts';
import { deletePostgreSQL } from '../../api/postgresql/delete_postgresql.ts';

const router = Router();

router.get('/analytics', async (_req, res) => {
  try {
    const result = await selectPostgreSQL();
    res.status(200).json({
      status: 'Success',
      data: result.rows
    });
  } catch (err) {
    console.error('PostgreSQL select error:', err);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch analytics'
    });
  }
});

router.post('/select', async (req, res) => {
  try {
    const result = await selectPostgreSQL(req.body); // expects filter criteria
    res.status(200).json({
      status: 'Success',
      data: result.rows
    });
  } catch (err) {
    console.error('PostgreSQL select error:', err);
    res.status(500).json({
      status: 'Error',
      message: 'Failed to fetch analytics'
    });
  }
});

router.post('/insert', async (req, res) => {
  try {
    const result = await insertPostgreSQL(req.body);
    res.status(200).json({ status: 'Success', data: result });
  } catch (err) {
    console.error('PostgreSQL insert error:', err);
    res.status(500).json({ status: 'Error', message: 'Failed to insert analytics' });
  }
});

router.post('/update', async (req, res) => {
  try {
    const result = await updatePostgreSQL(req.body);
    res.status(200).json({ status: 'Success', data: result });
  } catch (err) {
    console.error('PostgreSQL update error:', err);
    res.status(500).json({ status: 'Error', message: 'Failed to update analytics' });
  }
});

router.post('/delete', async (req, res) => {
  try {
    const result = await deletePostgreSQL(req.body);
    res.status(200).json({ status: 'Success', data: result });
  } catch (err) {
    console.error('PostgreSQL delete error:', err);
    res.status(500).json({ status: 'Error', message: 'Failed to delete analytics' });
  }
});

export default router;