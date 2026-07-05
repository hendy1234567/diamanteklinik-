const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const session = require('express-session');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

app.use(cors());
app.use(express.json());

app.use(session({
  secret: 'secret123',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname)));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hendy281106',
  database: 'diamante_db'
});

db.connect((err) => {
  if (err) {
    console.log("Koneksi gagal:", err);
  } else {
    console.log("MySQL Connected");
  }
});

app.get('/', (req, res) => {
  res.send('Server jalan');
});

app.post('/login', (req, res) => {

  const { username, password } = req.body;

  db.query(
    'SELECT * FROM admin WHERE username = ? AND password = ?',
    [username, password],
    (err, results) => {

      if (err) {
        return res.status(500).json({
          message: 'Server Error'
        });
      }

      if (results.length > 0) {

        req.session.user = results[0];

        return res.json({
          message: 'Login berhasil'
        });

      }

      res.json({
        message: 'Login gagal'
      });

    }
  );

});

function isLogin(req, res, next) {

  if (req.session.user) {
    next();
  } else {
    res.status(401).json({
      message: 'Harus login dulu'
    });
  }

}

app.get('/logout', (req, res) => {

  req.session.destroy(() => {

    res.json({
      message: 'Logout berhasil'
    });

  });

});

app.post('/reservations', (req, res) => {

  const {
    name,
    email,
    keperluan,
    pesan,
    phone
  } = req.body;

  const sql = `
    INSERT INTO reservations
    (name,email,keperluan,pesan,phone)
    VALUES (?,?,?,?,?)
  `;

  db.query(
    sql,
    [
      name,
      email,
      keperluan.join(', '),
      pesan,
      phone
    ],
    (err, result) => {

      if (err) {

        console.log(err);

        return res.status(500).json({
          message: 'Gagal simpan'
        });

      }

      io.emit("reservationBaru", {
        nama: name,
        email: email
      });

      res.json({
        message: 'Berhasil disimpan ke database'
      });

    }
  );

});

app.get('/reservations', isLogin, (req, res) => {

  db.query(
    'SELECT * FROM reservations ORDER BY id DESC',
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(results);

    }
  );

});

app.delete('/reservations/:id', isLogin, (req, res) => {

  const id = req.params.id;

  db.query(
    'DELETE FROM reservations WHERE id = ?',
    [id],
    (err) => {

      if (err) {

        return res.status(500).json({
          message: 'Gagal hapus'
        });

      }

      res.json({
        message: 'Data berhasil dihapus'
      });

    }
  );

});

io.on("connection", (socket) => {
  console.log("Admin terhubung :", socket.id);

  socket.on("disconnect", () => {
    console.log("Admin keluar :", socket.id);
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});