import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import connectDB from "./config/db";
import plantsRouter from "./routes/plants";
import analyzeRouter from "./routes/analyze";
import scanRouter from "./routes/scan";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "DeepLeaf API running" });
});

app.use("/api/plants", plantsRouter);
app.use("/api/analyze", analyzeRouter);
app.use("/api/scan", scanRouter);

connectDB().then(() => {
  const server = http.createServer(app);
  // Render free tier drops connections after ~30s by default.
  // Set to 3 min to handle Tesseract init + ML job polling.
  server.setTimeout(180_000);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
