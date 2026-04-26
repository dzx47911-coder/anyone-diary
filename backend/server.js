const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'xiaodong-diary-secret-2026';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

async function initDatabase() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS diaries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        moods JSONB,
        mood_labels JSONB,
        custom_moods JSONB,
        content TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_user_date ON diaries(user_id, date)
    `);

    // 自动迁移：如果存在旧的 weather/mood 列，删除并添加新列
    const cols = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'diaries'
    `);
    const colNames = cols.rows.map(r => r.column_name);

    if (colNames.includes('weather')) {
      await client.query(`ALTER TABLE diaries DROP COLUMN weather`);
    }
    if (colNames.includes('mood')) {
      await client.query(`ALTER TABLE diaries DROP COLUMN mood`);
    }
    if (!colNames.includes('moods')) {
      await client.query(`ALTER TABLE diaries ADD COLUMN moods JSONB`);
    }
    if (!colNames.includes('mood_labels')) {
      await client.query(`ALTER TABLE diaries ADD COLUMN mood_labels JSONB`);
    }
    if (!colNames.includes('custom_moods')) {
      await client.query(`ALTER TABLE diaries ADD COLUMN custom_moods JSONB`);
    }

    console.log('数据库初始化完成');
  } finally {
    client.release();
  }
}

function formatDiary(row) {
  return {
    id: row.id,
    user_id: row.user_id,
    date: row.date,
    moods: row.moods,
    moodLabels: row.mood_labels,
    customMoods: row.custom_moods,
    content: row.content,
    created_at: row.created_at,
    updated_at: row.updated_at
  };
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
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: '请填写用户名和密码' });

  try {
    const existing = await pool.query('SELECT id FROM users WHERE username = $1', [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: '该用户名已注册' });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id',
      [username, hash]
    );
    const userId = result.rows[0].id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, userId, username });
  } catch (err) {
    console.error('注册错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: '用户名或密码错误' });

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, userId: user.id, username: user.username });
  } catch (err) {
    console.error('登录错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/diaries', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM diaries WHERE user_id = $1 ORDER BY date DESC',
      [req.userId]
    );
    res.json(result.rows.map(formatDiary));
  } catch (err) {
    console.error('获取日记错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.get('/api/diaries/:date', authenticate, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM diaries WHERE user_id = $1 AND date = $2',
      [req.userId, req.params.date]
    );
    res.json(result.rows[0] ? formatDiary(result.rows[0]) : null);
  } catch (err) {
    console.error('获取日记错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.post('/api/diaries', authenticate, async (req, res) => {
  const { date, moods, moodLabels, customMoods, content } = req.body;
  if (!date) return res.status(400).json({ error: '日期不能为空' });

  try {
    const check = await pool.query(
      'SELECT id FROM diaries WHERE user_id = $1 AND date = $2',
      [req.userId, date]
    );

    if (check.rows.length > 0) {
      const result = await pool.query(
        `UPDATE diaries SET moods = $1, mood_labels = $2, custom_moods = $3,
         content = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5 RETURNING *`,
        [JSON.stringify(moods), JSON.stringify(moodLabels), JSON.stringify(customMoods), content, check.rows[0].id]
      );
      res.json(formatDiary(result.rows[0]));
    } else {
      const result = await pool.query(
        `INSERT INTO diaries (user_id, date, moods, mood_labels, custom_moods, content)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [req.userId, date, JSON.stringify(moods), JSON.stringify(moodLabels), JSON.stringify(customMoods), content]
      );
      res.json(formatDiary(result.rows[0]));
    }
  } catch (err) {
    console.error('保存日记错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

app.delete('/api/diaries/:id', authenticate, async (req, res) => {
  try {
    await pool.query('DELETE FROM diaries WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ success: true });
  } catch (err) {
    console.error('删除日记错误:', err);
    res.status(500).json({ error: '服务器错误' });
  }
});

initDatabase().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`小董日记后端运行在 http://0.0.0.0:${PORT}`);
  });
});
