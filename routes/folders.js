// routes/folders.js
import express from "express";
import db from "../db/client.js";

const router = express.Router();

// GET /folders
router.get("/", async (req, res, next) => {
  try {
    const { rows } = await db.query(`SELECT * FROM folders`);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET /folders/:id
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;

    const { rows } = await db.query(`
      SELECT folders.*,
        COALESCE(json_agg(files) FILTER (WHERE files.id IS NOT NULL), '[]') AS files
      FROM folders
      LEFT JOIN files ON folders.id = files.folder_id
      WHERE folders.id = $1
      GROUP BY folders.id;
    `, [id]);

    if (rows.length === 0) return res.status(404).send("Folder not found");
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/files", async (req, res, next) => {
  const { id } = req.params;

  if (!req.body) {
    return res.status(400).send("Request body not provided");
  }

  const { name, size } = req.body;

  if (!name || !size) {
    return res.status(400).send("Missing required fields");
  }

  try {
    const folderCheck = await db.query(`SELECT * FROM folders WHERE id = $1`, [id]);
    if (folderCheck.rows.length === 0) return res.status(404).send("Folder not found");

    const { rows } = await db.query(
      `INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3) RETURNING *`,
      [name, size, id]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    next(err);
  }
});


export default router;
