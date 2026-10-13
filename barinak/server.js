const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { DatabaseSync } = require("node:sqlite");

const PORT = Number(process.env.PORT) || 8080;
const HOST = process.env.HOST || "127.0.0.1";
const ROOT = __dirname;
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(ROOT, "data");
fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(path.join(DATA_DIR, "barinak.db"));
db.exec("PRAGMA foreign_keys = ON; PRAGMA journal_mode = WAL;");
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), shelter_name TEXT NOT NULL,
    capacity INTEGER NOT NULL, daily_food REAL NOT NULL,
    last_backup TEXT, updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS animals (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, species TEXT NOT NULL, breed TEXT NOT NULL,
    gender TEXT NOT NULL, age REAL NOT NULL, status TEXT NOT NULL, arrival TEXT NOT NULL,
    location TEXT NOT NULL, kennel TEXT NOT NULL, chip TEXT, note TEXT
  );
  CREATE TABLE IF NOT EXISTS health (
    id TEXT PRIMARY KEY, animal_id TEXT NOT NULL, type TEXT NOT NULL, date TEXT NOT NULL,
    next_date TEXT, vet TEXT NOT NULL, note TEXT,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS stock (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, amount REAL NOT NULL,
    unit TEXT NOT NULL, critical REAL NOT NULL, expiry TEXT
  );
  CREATE TABLE IF NOT EXISTS stock_moves (
    id TEXT PRIMARY KEY, item_id TEXT NOT NULL, operation TEXT NOT NULL CHECK(operation IN ('in','out')),
    amount REAL NOT NULL, note TEXT, date TEXT NOT NULL, user_name TEXT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES stock(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS adoptions (
    id TEXT PRIMARY KEY, animal_id TEXT NOT NULL, applicant TEXT NOT NULL, phone TEXT NOT NULL,
    address TEXT NOT NULL, status TEXT NOT NULL, date TEXT NOT NULL,
    FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL, assignee TEXT NOT NULL,
    date TEXT NOT NULL, time TEXT NOT NULL, done INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS notices (
    id TEXT PRIMARY KEY, reporter TEXT NOT NULL, phone TEXT NOT NULL, location TEXT NOT NULL,
    description TEXT NOT NULL, priority TEXT NOT NULL, status TEXT NOT NULL, date TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, name TEXT NOT NULL, role TEXT NOT NULL, email TEXT NOT NULL UNIQUE
  );
  CREATE TABLE IF NOT EXISTS auth_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'admin', created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS auth_sessions (
    token_hash TEXT PRIMARY KEY, user_id INTEGER NOT NULL, expires_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth_users(id) ON DELETE CASCADE
  );
`);

function passwordHash(password, salt = crypto.randomBytes(16).toString("hex")) {
  return `${salt}:${crypto.scryptSync(password, salt, 64).toString("hex")}`;
}
function passwordMatches(password, stored) {
  const [salt, expected] = stored.split(":");
  const actual = crypto.scryptSync(password, salt, 64);
  return expected?.length === actual.length * 2 && crypto.timingSafeEqual(actual, Buffer.from(expected, "hex"));
}
if (!db.prepare("SELECT id FROM auth_users LIMIT 1").get()) {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  db.prepare("INSERT INTO auth_users (username, password_hash, role, created_at) VALUES (?, ?, 'admin', ?)").run(username, passwordHash(password), new Date().toISOString());
  if (!process.env.ADMIN_PASSWORD) console.warn("UYARI: Yerel varsayılan giriş admin / admin123. Canlı ortamda ADMIN_PASSWORD tanımlayın.");
}

const all = sql => db.prepare(sql).all();
const mapKeys = row => Object.fromEntries(Object.entries(row).map(([key, value]) => [key.replace(/_([a-z])/g, (_, c) => c.toUpperCase()), value]));

function readState() {
  const settings = db.prepare("SELECT * FROM settings WHERE id = 1").get();
  if (!settings) return null;
  return {
    version: 2,
    settings: {
      shelterName: settings.shelter_name,
      capacity: settings.capacity,
      dailyFood: settings.daily_food,
      lastBackup: settings.last_backup
    },
    animals: all("SELECT * FROM animals ORDER BY id").map(mapKeys),
    health: all("SELECT id, animal_id, type, date, next_date, vet, note FROM health").map(mapKeys),
    stock: all("SELECT * FROM stock").map(mapKeys),
    stockMoves: all("SELECT id, item_id, operation, amount, note, date, user_name AS user FROM stock_moves").map(mapKeys),
    adoptions: all("SELECT id, animal_id, applicant, phone, address, status, date FROM adoptions").map(mapKeys),
    tasks: all("SELECT * FROM tasks").map(row => ({ ...mapKeys(row), done: Boolean(row.done) })),
    notices: all("SELECT * FROM notices").map(mapKeys),
    users: all("SELECT * FROM users").map(mapKeys),
    updated: settings.updated_at
  };
}

function replaceState(state) {
 db.exec("BEGIN IMMEDIATE");
 try {
  const now = new Date().toISOString();
  for (const table of ["health", "stock_moves", "adoptions", "tasks", "notices", "users", "stock", "animals"]) db.exec(`DELETE FROM ${table}`);
  db.prepare("INSERT OR REPLACE INTO settings VALUES (1, ?, ?, ?, ?, ?)").run(state.settings.shelterName, state.settings.capacity, state.settings.dailyFood, state.settings.lastBackup || null, now);

  const animal = db.prepare("INSERT INTO animals VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
  state.animals.forEach(x => animal.run(x.id, x.name, x.species, x.breed, x.gender, x.age, x.status, x.arrival, x.location, x.kennel, x.chip || "", x.note || ""));
  const health = db.prepare("INSERT INTO health VALUES (?, ?, ?, ?, ?, ?, ?)");
  state.health.forEach(x => health.run(x.id, x.animalId, x.type, x.date, x.nextDate || null, x.vet, x.note || ""));
  const stock = db.prepare("INSERT INTO stock VALUES (?, ?, ?, ?, ?, ?, ?)");
  state.stock.forEach(x => stock.run(x.id, x.name, x.category, x.amount, x.unit, x.critical, x.expiry || null));
  const move = db.prepare("INSERT INTO stock_moves VALUES (?, ?, ?, ?, ?, ?, ?)");
  state.stockMoves.forEach(x => move.run(x.id, x.itemId, x.operation, x.amount, x.note || "", x.date, x.user));
  const adoption = db.prepare("INSERT INTO adoptions VALUES (?, ?, ?, ?, ?, ?, ?)");
  state.adoptions.forEach(x => adoption.run(x.id, x.animalId, x.applicant, x.phone, x.address, x.status, x.date));
  const task = db.prepare("INSERT INTO tasks VALUES (?, ?, ?, ?, ?, ?, ?)");
  state.tasks.forEach(x => task.run(x.id, x.title, x.category, x.assignee, x.date, x.time, x.done ? 1 : 0));
  const notice = db.prepare("INSERT INTO notices VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
  state.notices.forEach(x => notice.run(x.id, x.reporter, x.phone, x.location, x.description, x.priority, x.status, x.date));
  const user = db.prepare("INSERT INTO users VALUES (?, ?, ?, ?)");
  state.users.forEach(x => user.run(x.id, x.name, x.role, x.email));
  db.exec("COMMIT");
 } catch (error) {
  db.exec("ROLLBACK");
  throw error;
 }
}

function json(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
}

function cookies(req) {
  return Object.fromEntries((req.headers.cookie || "").split(";").filter(Boolean).map(value => value.trim().split(/=(.*)/s).slice(0, 2).map(decodeURIComponent)));
}
function currentUser(req) {
  const token = cookies(req).barinak_session;
  if (!token) return null;
  return db.prepare(`SELECT u.id, u.username, u.role FROM auth_sessions s JOIN auth_users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at>?`).get(crypto.createHash("sha256").update(token).digest("hex"), new Date().toISOString()) || null;
}
function readJson(req, callback) {
  let body = "";
  req.on("data", chunk => { body += chunk; if (body.length > 5_000_000) req.destroy(); });
  req.on("end", () => { try { callback(null, JSON.parse(body || "{}")); } catch { callback(new Error("Geçersiz JSON")); } });
}

const attempts = new Map();
function login(req, res) {
  const ip = req.socket.remoteAddress || "unknown", recent = (attempts.get(ip) || []).filter(time => Date.now() - time < 15 * 60_000);
  if (recent.length >= 10) return json(res, 429, { error: "Çok fazla deneme. Daha sonra tekrar deneyin." });
  readJson(req, (error, body) => {
    if (error) return json(res, 400, { error: error.message });
    const user = db.prepare("SELECT * FROM auth_users WHERE username=?").get(String(body.username || ""));
    if (!user || !passwordMatches(String(body.password || ""), user.password_hash)) {
      recent.push(Date.now()); attempts.set(ip, recent);
      return json(res, 401, { error: "Kullanıcı adı veya şifre hatalı" });
    }
    attempts.delete(ip);
    const token = crypto.randomBytes(32).toString("base64url"), expires = new Date(Date.now() + 12 * 60 * 60_000);
    db.prepare("DELETE FROM auth_sessions WHERE expires_at <= ?").run(new Date().toISOString());
    db.prepare("INSERT INTO auth_sessions VALUES (?, ?, ?)").run(crypto.createHash("sha256").update(token).digest("hex"), user.id, expires.toISOString());
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader("Set-Cookie", `barinak_session=${token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=43200${secure}`);
    json(res, 200, { username: user.username, role: user.role });
  });
}

function serveStatic(req, res) {
  let pathname;
  try { pathname = decodeURIComponent(new URL(req.url, `http://${req.headers.host}`).pathname); }
  catch { return json(res, 400, { error: "Geçersiz adres" }); }
  if (pathname === "/") pathname = "/index.html";
  const file = path.resolve(ROOT, `.${pathname}`);
  if (!file.startsWith(ROOT) || file.startsWith(DATA_DIR)) return json(res, 403, { error: "Erişim reddedildi" });
  const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8" };
  fs.readFile(file, (error, content) => {
    if (error) return json(res, 404, { error: "Dosya bulunamadı" });
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.url === "/api/health" && req.method === "GET") return json(res, 200, { ok: true, database: "sqlite" });
  if (req.url === "/api/login" && req.method === "POST") return login(req, res);
  if (req.url === "/api/session" && req.method === "GET") {
    const user = currentUser(req); return user ? json(res, 200, user) : json(res, 401, { error: "Oturum gerekli" });
  }
  if (req.url === "/api/logout" && req.method === "POST") {
    const token = cookies(req).barinak_session;
    if (token) db.prepare("DELETE FROM auth_sessions WHERE token_hash=?").run(crypto.createHash("sha256").update(token).digest("hex"));
    res.setHeader("Set-Cookie", "barinak_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0");
    return json(res, 200, { ok: true });
  }
  if (req.url.startsWith("/api/") && !currentUser(req)) return json(res, 401, { error: "Oturum gerekli" });
  if (req.url === "/api/state" && req.method === "GET") return json(res, 200, readState());
  if (req.url === "/api/state" && req.method === "PUT") {
    readJson(req, (parseError, state) => {
      try {
        if (parseError) throw parseError;
        if (state?.version !== 2 || !state.settings || !Array.isArray(state.animals)) throw new Error("Geçersiz veri");
        replaceState(state);
        json(res, 200, readState());
      } catch (error) { json(res, 400, { error: error.message || "Kayıt başarısız" }); }
    });
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, HOST, () => console.log(`Barınak sistemi http://${HOST}:${PORT} adresinde çalışıyor`));
