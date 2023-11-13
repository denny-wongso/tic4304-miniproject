const express = require('express');
const ejs = require('ejs');
const cors = require('cors');
const { login, insertUser, verifyToken, logout } = require('./apis/authentication');
const { submitDetail } = require('./apis/form');


const app = express();
app.use(express.static('public'));
app.engine('html', ejs.renderFile);
app.set('view engine', 'html');
app.use(express.json())
app.use(cors());

const PORT = 8020;
const HOST = '';
const local_path = '/api/v1/';

// Middleware to verify JWT
const verifyTokenMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = await verifyToken(token);
    if(decoded == "") {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      req.user = decoded;
      next();
    }
  } catch (error) {
    console.error('Error verifying token', error);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

app.post(local_path + 'login', (req, res) => {
  const { email, password } = req.body;
  login(email, password, async function(data) {
    res.status(data.statusCode).json(data.data)
  })
})

app.post(local_path + 'signup', (req, res) => {
  const {email, password } = req.body;
  insertUser(email, password, async function(data) {
    res.status(200).json({})
  })
})

app.post(local_path + 'logout', verifyTokenMiddleware, (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader.split(' ')[1];

  logout(token, async function(data) {
    res.status(data.statusCode).json(data.data)
  })
})

app.post(local_path + 'userDetails', verifyTokenMiddleware, (req, res) => {
  const { name, email, phone, country, gender, qualification } = req.body;
  submitDetail(name, email, phone, country, gender, qualification, async function(data) {
    res.status(data.statusCode).json(data.data)
  })
});


app.listen(PORT, HOST, () => {
  console.log(`Example app listening on port ${PORT}`);
});

module.exports = app