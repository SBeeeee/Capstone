import "dotenv/config";
import express from "express";
import cors from "cors";
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
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
