import { Router } from 'express';
import { insertRedis } from "../../api/redis/insert_redis.ts";
import { selectRedis } from "../../api/redis/select_redis.ts";
import { updateRedis } from "../../api/redis/update_redis.ts";
import { deleteRedis } from "../../api/redis/delete_redis.ts";

const router = Router();

// INSERT
router.post("/insert", async (req, res) => {
  try {
    const result = await insertRedis(req.body);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// SELECT
router.post("/select", async (req, res) => {
  try {
    const { key } = req.body; // Ensure key is extracted from the body
    if (typeof key !== 'string') {
      throw new Error("Invalid key type. Expected a string.");
    }

    const result = await selectRedis(key);  // Call selectRedis with the key
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE
router.post("/update", async (req, res) => {
  try {
    const result = await updateRedis(req.body);
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE
router.post("/delete", async (req, res) => {
  try {
    const { key } = req.body;  // Extract key from body
    if (typeof key !== 'string') {
      throw new Error("Invalid key type. Expected a string.");
    }

    const result = await deleteRedis(key);  // Call deleteRedis with the key
    res.json({ success: true, data: result });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;