
import express from "express";
import filesRouter from "./routes/files.js";
import foldersRouter from "./routes/folders.js";

const app = express();

app.use(express.json());
app.use("/files", filesRouter);
app.use("/folders", foldersRouter);

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});

export default app;

