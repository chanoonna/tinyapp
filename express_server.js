const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const PORT = 8080;
const URLDataBaseClass = require('./db/urlDatabase');
const UserDataBaseClass = require('./db/userDatabase');

const server = function startExpressServer() {
  const server = express();
  server.set('view engine', 'ejs');
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(cookieParser());

  return server;
};

const app = server();
const urls = new URLDataBaseClass.URLDataBase();                  // URL Database
const users = new UserDataBaseClass.UserDataBase();               // User Database

const checkCookie = function(cookie) {
  if (!cookie || users.findUserByID(cookie) === undefined) {
    return undefined;
  }

  return users.getUser(cookie).getEmail();
};

app.get('/', (req, res) => {
  res.send('Hello.');
});

app.get('/urls.json', (req, res) => {
  res.json(urls.getDB());
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  const user = checkCookie(req.cookies['id']);
  const templateVars = { urls: urls.getDB(), user, };
  res.render('urls_index', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  res.redirect(urls.getURL(req.params.shortURL));
});

app.get('/urls/new', (req, res) => {
  const user = checkCookie(req.cookies['id']);
  res.render('urls_new', { user, });
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (!Object.prototype.hasOwnProperty.call(urls.getDB(), shortURL)) {
    res.statusCode = 404;
    res.send('404 page not found');
    return;
  }
  const user = checkCookie(req.cookies['id']);
  const longURL = urls.getURL(shortURL);
  const templateVars = { shortURL, longURL, user, };
  res.render('urls_show', templateVars);
});

app.get('/signup', (req, res) => {
  const user = checkCookie(req.cookies['id']);
  const templateVars = { user, email: false, password: false };
  res.render('urls_signup', templateVars);
});

app.get('/signin', (req, res) => {
  const user = checkCookie(req.cookies['id']);
  const templateVars = { user, invalid: false };
  res.render('urls_signin', templateVars);
});

app.post('/urls', (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = urls.addURL(longURL);
  const user = checkCookie(req.cookies['id']);
  const templateVars = { shortURL, longURL, user, };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  urls.delURL(shortURL);
  const user = checkCookie(req.cookies['id']);
  const templateVars = { urls: urls.getDB(), user, };
  res.render('urls_index', templateVars);
});

app.post('/urls/:shortURL/update', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  
  urls.fixURL(shortURL, longURL);
  const user = checkCookie(req.cookies['id']);

  const templateVars = { urls: urls.getDB(), user, };
  res.render('urls_index', templateVars);
});

app.post('/signin', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const user = users.findUserByEmail(email);
  
  if (user === undefined || user.password !== password) {
    res.render('urls_signin', { user: undefined, invalid: true });
    return;
  } else {
    res.cookie('id', user.id);
    const templateVars = { urls: urls.getDB(), user: user.getEmail() };
    res.render('urls_index', templateVars);
  }
});

app.post('/signout', (req, res) => {
  res.clearCookie('id', {expires: new Date(1), path: '/' });
  return res.status(200).redirect('/urls');
});

app.post('/signup', (req, res) => {
  const email = req.body.email;
  const password1 = req.body.password1;
  const password2 = req.body.password2;
  const user = checkCookie(req.cookies['id']);

  if (users.findUserByEmail(email) !== undefined) {
    res.render('urls_signup', { email: true, password: false, user, });
    return;    
  } else if (password1 !== password2) {
    res.render('urls_signup', { email: false, password: true, user, })
  } else {
    const user = users.addUser(email, password1);
    res.cookie('id', user.id);
    const templateVars = { urls: urls.getDB(), user: user.getEmail() };
    res.render('urls_index', templateVars);
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});