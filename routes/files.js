// routes/files.js
import express from "express";
import db from "../db/client.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query(`
      SELECT files.*, folders.name AS folder_name
      FROM files
      JOIN folders ON files.folder_id = folders.id
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

export default router;
