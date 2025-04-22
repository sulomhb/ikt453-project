import { Router } from 'express';
import { selectMongoDB } from '../../api/mongodb/select_mongodb.ts';
import { insertMongoDB } from '../../api/mongodb/insert_mongodb.ts';
import { updateMongoDB } from '../../api/mongodb/update_mongodb.ts';
import { deleteMongoDB } from '../../api/mongodb/delete_mongodb.ts';

const router = Router();

router.get('/clinical', async (_req, res) => {
  try {
    const data = await selectMongoDB();
    res.status(200).json({ status: 'Success', data });
  } catch (err) {
    console.error('MongoDB select error:', err);
    res.status(500).json({ status: 'Error', message: 'Failed to fetch clinical data' });
  }
});

router.post('/select', async (req, res) => {
  try {
    const data = await selectMongoDB(req.body); // expects e.g., { "Diagnosis_ID": 1 }
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

router.post('/insert', async (req, res) => {
  try {
    const data = await insertMongoDB(req.body);
    res.status(200).json({ status: 'Success', data });
  } catch (err) {
    console.error('MongoDB insert error:', err);
    res.status(500).json({ status: 'Error', message: 'Failed to insert clinical data' });
  }
});

router.post('/update', async (_req, res) => {
  try {
    const data = await updateMongoDB(_req.body);
    res.status(200).json({ status: 'Success', data });
  } catch (err) {
    console.error('MongoDB update error:', err);
    res.status(500).json({ status: 'Error', message: 'Failed to update clinical data' });
  }
});

router.post('/delete', async (_req, res) => {
  try {
    const data = await deleteMongoDB();
    res.status(200).json({ status: 'Success', data });
  } catch (err) {
    console.error('MongoDB delete error:', err);
    res.status(500).json({ status: 'Error', message: 'Failed to delete clinical data' });
  }
});

export default router;