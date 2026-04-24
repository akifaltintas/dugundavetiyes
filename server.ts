import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";

const VISITORS_FILE = path.join(process.cwd(), "visitors.json");

function getVisitorCount(): number {
  try {
    if (fs.existsSync(VISITORS_FILE)) {
      const data = fs.readFileSync(VISITORS_FILE, "utf-8");
      return JSON.parse(data).count || 0;
    }
  } catch (error) {
    console.error("Error reading visitor count:", error);
  }
  return 0;
}

function incrementVisitorCount(): number {
  const count = getVisitorCount() + 1;
  try {
    fs.writeFileSync(VISITORS_FILE, JSON.stringify({ count }));
  } catch (error) {
    console.error("Error saving visitor count:", error);
  }
  return count;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route for visitor count
  app.get("/api/visitors", (req, res) => {
    const count = incrementVisitorCount();
    res.json({ count });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
