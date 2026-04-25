const express = require('express');
const cors = require('cors');
const initSqlJs = require('sql.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'xiaodong-diary-secret-2026';

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

let db;

async function initDatabase() {
  const SQL = await initSqlJs();
  const dbDir = path.join(__dirname, 'db');
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
  const dbPath = path.join(dbDir, 'diary.db');

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS diaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      weather TEXT,
      mood TEXT,
      content TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  db.run(`CREATE UNIQUE INDEX IF NOT EXISTS idx_user_date ON diaries(user_id, date)`);

  console.log('数据库初始化完成');
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  const dbPath = path.join(__dirname, 'db', 'diary.db');
  fs.writeFileSync(dbPath, buffer);
}

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: '未登录' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ error: '无效的 token' });
  }
};

app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: '请填写邮箱和密码' });

  const checkStmt = db.prepare('SELECT id FROM users WHERE email = ?');
  checkStmt.bind([email]);
  const exists = checkStmt.step();
  checkStmt.free();

  if (exists) return res.status(400).json({ error: '该邮箱已注册' });

  const hash = await bcrypt.hash(password, 10);
  db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hash]);

  const result = db.exec('SELECT last_insert_rowid() as id');
  const userId = result[0].values[0][0];

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
  saveDatabase();
  res.json({ token, userId });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  stmt.bind([email]);
  if (!stmt.step()) {
    stmt.free();
    return res.status(401).json({ error: '邮箱或密码错误' });
  }
  const user = stmt.getAsObject();
  stmt.free();

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) return res.status(401).json({ error: '邮箱或密码错误' });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, userId: user.id });
});

app.get('/api/diaries', authenticate, (req, res) => {
  const stmt = db.prepare('SELECT * FROM diaries WHERE user_id = ? ORDER BY date DESC');
  stmt.bind([req.userId]);
  const diaries = [];
  while (stmt.step()) {
    diaries.push(stmt.getAsObject());
  }
  stmt.free();
  res.json(diaries);
});

app.get('/api/diaries/:date', authenticate, (req, res) => {
  const stmt = db.prepare('SELECT * FROM diaries WHERE user_id = ? AND date = ?');
  stmt.bind([req.userId, req.params.date]);
  if (stmt.step()) {
    const diary = stmt.getAsObject();
    stmt.free();
    res.json(diary);
  } else {
    stmt.free();
    res.json(null);
  }
});

app.post('/api/diaries', authenticate, (req, res) => {
  const { date, weather, mood, content } = req.body;
  if (!date) return res.status(400).json({ error: '日期不能为空' });

  const checkStmt = db.prepare('SELECT id FROM diaries WHERE user_id = ? AND date = ?');
  checkStmt.bind([req.userId, date]);
  if (checkStmt.step()) {
    const existingId = checkStmt.getAsObject().id;
    checkStmt.free();
    db.run('UPDATE diaries SET weather = ?, mood = ?, content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [weather, mood, content, existingId]);
    const getStmt = db.prepare('SELECT * FROM diaries WHERE id = ?');
    getStmt.bind([existingId]);
    getStmt.step();
    const updated = getStmt.getAsObject();
    getStmt.free();
    saveDatabase();
    res.json(updated);
  } else {
    checkStmt.free();
    db.run('INSERT INTO diaries (user_id, date, weather, mood, content) VALUES (?, ?, ?, ?, ?)',
      [req.userId, date, weather, mood, content]);
    const result = db.exec('SELECT last_insert_rowid() as id');
    const diaryId = result[0].values[0][0];
    const getStmt = db.prepare('SELECT * FROM diaries WHERE id = ?');
    getStmt.bind([diaryId]);
    getStmt.step();
    const diary = getStmt.getAsObject();
    getStmt.free();
    saveDatabase();
    res.json(diary);
  }
});

app.delete('/api/diaries/:id', authenticate, (req, res) => {
  db.run('DELETE FROM diaries WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
  saveDatabase();
  res.json({ success: true });
});

initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`小董日记后端运行在 http://0.0.0.0:${PORT}`);
  });
});