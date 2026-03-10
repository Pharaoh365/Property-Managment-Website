import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize SQLite database
  const db = new Database("properties.db");
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      address TEXT NOT NULL,
      price REAL NOT NULL,
      beds INTEGER,
      baths REAL,
      sqft INTEGER,
      type TEXT,
      status TEXT DEFAULT 'active',
      image_url TEXT,
      description TEXT,
      neighborhood TEXT,
      rating REAL DEFAULT 0,
      available_date TEXT,
      lat REAL,
      lng REAL
    );

    CREATE TABLE IF NOT EXISTS maintenance_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      property_id INTEGER,
      tenant_id TEXT,
      issue TEXT NOT NULL,
      status TEXT DEFAULT 'pending',
      priority TEXT DEFAULT 'medium',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (property_id) REFERENCES properties (id)
    );
  `);

  // Seed data if empty
  const count = db.prepare("SELECT count(*) as count FROM properties").get() as { count: number };
  if (count.count === 0) {
    const insert = db.prepare(`
      INSERT INTO properties (title, address, price, beds, baths, sqft, type, image_url, description, neighborhood, rating, available_date, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    insert.run(
      "Modern Downtown Loft", 
      "123 Main St, Virginia Beach, VA", 
      2200, 2, 2, 1200, "Apartment", 
      "https://picsum.photos/seed/loft/800/600",
      "Beautiful modern loft in the heart of downtown.",
      "Downtown", 4.5, "Available Now", 36.8508, -76.2859
    );
    insert.run(
      "Cozy Suburban Home", 
      "456 Oak Ave, Norfolk, VA", 
      1800, 3, 2, 1500, "Single Family", 
      "https://picsum.photos/seed/suburban/800/600",
      "Perfect family home with a large backyard.",
      "Ghent", 4.8, "Available Now", 36.8644, -76.2853
    );
    insert.run(
      "Luxury Beachfront Condo", 
      "789 Ocean Blvd, Virginia Beach, VA", 
      3500, 3, 3, 2000, "Condo", 
      "https://picsum.photos/seed/beach/800/600",
      "Stunning ocean views and premium amenities.",
      "Oceanfront", 5.0, "Available Now", 36.8529, -75.9780
    );
    insert.run(
      "Beautiful Coastal Home - Ocean View", 
      "9620 17th Bay Street, Norfolk, VA 23503", 
      4000, 4, 2.5, 2432, "Single Family", 
      "https://picsum.photos/seed/oceanview/800/600",
      "Beautiful coastal home just steps from the ocean. Conveniently located near several military installations and bases.",
      "Ocean View", 4.9, "Available Now", 36.9531, -76.2483
    );

    // Add some occupied properties
    const insertOccupied = db.prepare(`
      INSERT INTO properties (title, address, price, beds, baths, sqft, type, status, image_url, description, neighborhood, rating, available_date, lat, lng)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'occupied', ?, ?, ?, ?, ?, ?, ?)
    `);
    insertOccupied.run("Ghent Historic Flat", "101 Colley Ave, Norfolk, VA", 1600, 1, 1, 900, "Apartment", "https://picsum.photos/seed/ghent/800/600", "Historic charm in the heart of Ghent.", "Ghent", 4.2, "April 15, 2026", 36.8700, -76.3000);
    insertOccupied.run("Bayside Family House", "202 Shore Dr, Virginia Beach, VA", 2800, 4, 2.5, 2200, "Single Family", "https://picsum.photos/seed/bayside/800/600", "Spacious family home near the bay.", "Bayside", 4.6, "May 1, 2026", 36.8850, -76.1200);
    insertOccupied.run("Oceanview Studio", "555 Ocean Ave, Virginia Beach, VA", 1200, 0, 1, 500, "Apartment", "https://picsum.photos/seed/studio/800/600", "Compact studio with amazing views.", "Oceanfront", 4.0, "June 10, 2026", 36.8400, -75.9800);
  }

  app.use(express.json());

  // API Routes
  app.get("/api/properties", (req, res) => {
    const status = req.query.status || 'active';
    const properties = db.prepare("SELECT * FROM properties WHERE status = ?").all(status);
    res.json(properties);
  });

  app.get("/api/properties/upcoming", (req, res) => {
    const properties = db.prepare("SELECT * FROM properties WHERE status IN ('occupied', 'past')").all();
    res.json(properties);
  });

  app.get("/api/properties/all", (req, res) => {
    const properties = db.prepare("SELECT * FROM properties").all();
    res.json(properties);
  });

  app.get("/api/pm/stats", (req, res) => {
    const total = db.prepare("SELECT count(*) as count FROM properties").get() as { count: number };
    const active = db.prepare("SELECT count(*) as count FROM properties WHERE status = 'active'").get() as { count: number };
    const occupied = db.prepare("SELECT count(*) as count FROM properties WHERE status = 'occupied'").get() as { count: number };
    const maintenance = db.prepare("SELECT count(*) as count FROM maintenance_requests WHERE status = 'pending'").get() as { count: number };
    
    res.json({
      total: total.count,
      active: active.count,
      occupied: occupied.count,
      pendingMaintenance: maintenance.count,
      occupancyRate: ((occupied.count / total.count) * 100).toFixed(1)
    });
  });

  app.get("/api/properties/:id", (req, res) => {
    const property = db.prepare("SELECT * FROM properties WHERE id = ?").get(req.params.id);
    res.json(property);
  });

  app.post("/api/maintenance", (req, res) => {
    const { property_id, issue, priority } = req.body;
    const info = db.prepare("INSERT INTO maintenance_requests (property_id, issue, priority) VALUES (?, ?, ?)")
      .run(property_id, issue, priority);
    res.json({ id: info.lastInsertRowid, status: "success" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
