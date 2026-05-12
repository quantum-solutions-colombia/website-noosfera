import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/generate-image", (req, res) => {
  const { style, emotionalState } = req.body;
  const query = encodeURIComponent(`${style || "cardiac"} ${emotionalState || "art"} visualization`);
  const imageUrl = `/placeholder.svg?height=600&width=800&query=${query}`;
  res.json({ imageUrl });
});

const uploadsDir = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

router.post("/upload-image", upload.single("file"), (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.png`;
  const filepath = path.join(uploadsDir, filename);
  fs.writeFileSync(filepath, req.file.buffer);
  res.json({ url: `/api/uploads/${filename}` });
});

router.get("/uploads/:filename", (req, res) => {
  const filepath = path.join(uploadsDir, req.params.filename);
  if (!fs.existsSync(filepath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  res.sendFile(filepath);
});

export default router;
