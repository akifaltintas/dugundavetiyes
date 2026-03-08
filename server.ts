import express from "express";
import { createServer as createViteServer } from "vite";
import { google } from "googleapis";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import Database from "better-sqlite3";

dotenv.config();

const app = express();
const PORT = 3000;
const db = new Database("wedding.db");

// Initialize DB
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  )
`);

const upload = multer({ dest: "uploads/" });

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL}/auth/google/callback`
);

async function startServer() {
  // API Routes
  app.get("/api/auth/status", (req, res) => {
    const tokens = db.prepare("SELECT value FROM settings WHERE key = ?").get("google_tokens");
    res.json({ connected: !!tokens });
  });

  app.get("/api/auth/google/url", (req, res) => {
    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: ["https://www.googleapis.com/auth/drive.file"],
      prompt: "consent"
    });
    res.json({ url });
  });

  app.get("/auth/google/callback", async (req, res) => {
    const { code } = req.query;
    try {
      const { tokens } = await oauth2Client.getToken(code as string);
      db.prepare("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)").run("google_tokens", JSON.stringify(tokens));
      
      res.send(`
        <html>
          <body>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
            <p>Bağlantı başarılı! Bu pencere otomatik olarak kapanacaktır.</p>
          </body>
        </html>
      `);
    } catch (error) {
      console.error("Google Auth Error:", error);
      res.status(500).send("Authentication failed");
    }
  });

  app.post("/api/upload", upload.single("photo"), async (req, res) => {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const tokensRow = db.prepare("SELECT value FROM settings WHERE key = ?").get("google_tokens") as { value: string } | undefined;
    if (!tokensRow) return res.status(401).json({ error: "Google Drive not connected" });

    const tokens = JSON.parse(tokensRow.value);
    oauth2Client.setCredentials(tokens);

    const drive = google.drive({ version: "v3", auth: oauth2Client });

    try {
      // 1. Find or create "Wedding Photos" folder
      let folderId = db.prepare("SELECT value FROM settings WHERE key = ?").get("folder_id") as { value: string } | undefined;
      
      if (!folderId) {
        const folderMetadata = {
          name: "Şeymanur & Akif Düğün Fotoğrafları",
          mimeType: "application/vnd.google-apps.folder",
        };
        const folder = await drive.files.create({
          requestBody: folderMetadata,
          fields: "id",
        });
        folderId = { value: folder.data.id! };
        db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)").run("folder_id", folderId.value);
      }

      // 2. Upload file
      const fileMetadata = {
        name: `guest_${Date.now()}_${file.originalname}`,
        parents: [folderId.value],
      };
      const media = {
        mimeType: file.mimetype,
        body: fs.createReadStream(file.path),
      };

      await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });

      // Cleanup local file
      fs.unlinkSync(file.path);

      res.json({ success: true });
    } catch (error) {
      console.error("Drive Upload Error:", error);
      res.status(500).json({ error: "Upload failed" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
