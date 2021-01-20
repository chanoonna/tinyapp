const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 8080;
const {
  getDB,
  getURL,
  addURL,
  delURL,
  fixURL,
} = require('./db/urlDatabase');

const server = function startExpressServer() {
  const server = express();
  server.set('view engine', 'ejs');
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(cookieParser());

  return server;
};

const app = server();

app.get('/', (req, res) => {
  res.send('Hello.');
});

app.get('/urls.json', (req, res) => {
  res.json(getDB());
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: getDB(), username: req.cookies['username'], };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const templateVars = { username: req.cookies['username'], };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (!Object.prototype.hasOwnProperty.call(getDB(), shortURL)) {
    res.statusCode = 404;
    res.send('404 page not found');
    return;
  }
  const templateVars = {
    shortURL,
    longURL: getURL(shortURL),
    username: req.cookies['username'],
  };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = addURL(longURL);
  const templateVars = {
    shortURL,
    longURL,
    username: req.cookies['username'],
  };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  delURL(shortURL);
  const templateVars = { urls: getDB(), username: req.cookies['username'], };
  res.render('urls_index', templateVars);
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;

  if (longURL === 0) {
    res.send("<script>alert(\"Please provide URL\"); </script>");
  } else {
    fixURL(shortURL, longURL);
  }
  const templateVars = { urls: getDB(), username: req.cookies['username'], };
  res.render('urls_index', templateVars);
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  res.cookie('username', username);
  const templateVars = { urls: getDB(), username, };
  res.render('urls_index', templateVars);
});

app.post('/logout', (req, res) => {
  if (req.cookies['username']) {
    res.clearCookie('username', {expires: new Date(1), path: '/' });
    console.log(req.cookies['username']);
    return res.status(200).redirect('/urls')
  }
  const templateVars = { urls: getDB(), username: req.cookies['username'], };
  res.render('urls_index', templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});