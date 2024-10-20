const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000; // Có thể thay đổi nếu cần

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Huynh2506@',
  database: 'quan_li_kho_hang',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Serve login page
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});
app.get('/style-login.css', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/style-login.css'));
});
app.get('/img/logo.png', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/img/logo.png'));
});
// Redirect root to login page
app.get('/', (req, res) => {
  res.redirect('/login');
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Tên đăng nhập không tồn tại' });
    }

    const user = rows[0];
    const passwordMatch = await bcrypt.compare(password, "12345");

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Mật khẩu không đúng' });
    }

    // Đăng nhập thành công
    res.status(200).json({ message: 'Đăng nhập thành công', user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    res.status(500).json({ message: 'Đã xảy ra lỗi server' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
