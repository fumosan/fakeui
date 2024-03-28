const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');


const path = require('path');
const app = express();
const db = new sqlite3.Database('./mydatabase.db');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // 'public' 是包含你的前端文件的目录

// 處理發送消息的請求
app.post('/send', (req, res) => {
    const { message } = req.body;
    const timestamp = new Date().toISOString();
    const insert = 'INSERT INTO messages (name, content, time) VALUES (?, ?, ?)';
    db.run(insert, ['User', message, timestamp], (err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('A message has been inserted');
        res.json({ status: 'success', message: 'Message sent' });
    });
});

// 獲取最近的消息
app.get('/messages', (req, res) => {
    const select = 'SELECT * FROM messages ORDER BY id DESC LIMIT 20';
    db.all(select, [], (err, rows) => {
        if (err) {
            return console.error(err.message);
        }
        res.json(rows.reverse()); // 將消息反轉以顯示最新消息在底部
    });
});

const PORT = process.env.PORT || 9123;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
