const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const PORT = 8080;
const URLDataBaseClass = require('./db/urlDatabase');
const UserDataBaseClass = require('./db/userDatabase');
const bcrypt = require('bcrypt');
const {
  checkCookie,
  getMyList,
} = require('./src/helper');

const server = function() {
  const server = express();
  server.set('view engine', 'ejs');
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(cookieSession({
    name: 'session',
    keys: ['chicken'],
  }));

  return server;
};

const app = server();
const urls = new URLDataBaseClass.URLDataBase();                  // URL Database
const users = new UserDataBaseClass.UserDataBase();               // User Database

app.get('/', (req, res) => {
  res.send('Hello.');
});

app.get('/urls.json', (req, res) => {
  const user = checkCookie(req.session.user, users);

  if (user === undefined) {
    res.status(403).redirect('/signin');
    return;
  }
  const myList = getMyList(user, urls);
  res.json(myList);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  const user = checkCookie(req.session.user, users);

  if (user === undefined) {
    res.status(403).redirect('/signin');
    return;
  }
  const myList = getMyList(user, urls);
  const templateVars = { urls: myList, user, };
  res.render('urls_index', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  res.redirect(urls.getURL(req.params.shortURL));
});

app.get('/urls/new', (req, res) => {
  const user = checkCookie(req.session.user, users);

  if (user === undefined) {
    res.status(403).redirect('/signin');
    return;
  }
  res.render('urls_new', { user, });
});

app.get('/denied', (req, res) => {
  const user = checkCookie(req.session.user, users);

  if (user === undefined) {
    res.status(403).redirect('/signin');
    return;
  }

  res.render('urls_denied', { user, });
});

app.get('/urls/:shortURL', (req, res) => {
  const user = checkCookie(req.session.user, users);
  
  if (user === undefined) {
    res.status(403).redirect('/signin');
    return;
  }

  const shortURL = req.params.shortURL;

  if (user.getID() !== urls.getDB()[shortURL].userID) {
    res.status(403).redirect('/denied');
    return;
  }

  if (!Object.prototype.hasOwnProperty.call(urls.getDB(), shortURL)) {
    res.statusCode = 404;
    res.send('404 page not found');
    return;
  }

  const longURL = urls.getURL(shortURL);
  const templateVars = { shortURL, longURL, user, };
  res.render('urls_show', templateVars);
});

app.get('/signup', (req, res) => {
  const user = checkCookie(req.session.user, users);

  if (user !== undefined) {
    res.status(200).redirect('/signin');
    return;
  }

  const templateVars = { user: undefined, email: false, other: false };
  res.render('urls_signup', templateVars);
});

app.get('/signin', (req, res) => {
  const user = checkCookie(req.session.user, users);
  const templateVars = { user, invalid: false };
  res.render('urls_signin', templateVars);
});

app.get('*', (req, res) => {
  res.status(404).send('404 page not found');
});

app.post('/urls/new', (req, res) => {
  const user = checkCookie(req.session.user, users);
  
  if (user === undefined) {
    res.status(403).redirect('/signin');
    return;
  }

  const longURL = req.body.longURL;
  const shortURL = urls.addURL(longURL, user.getID());
  user.addURL(shortURL);

  const templateVars = { shortURL, longURL, user, };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const user = checkCookie(req.session.user, users);
  
  if (user === undefined) {
    res.status(403).redirect('/signin');
    return;
  }

  const shortURL = req.params.shortURL;

  if (urls.urls[shortURL].userID !== user.getID()) {
    res.status(403).redirect('/denied');
    return;
  }

  urls.delURL(shortURL);
  user.delURL(shortURL);
  res.status(200).redirect('/urls');
});

app.post('/urls/:shortURL/update', (req, res) => {
  const user = checkCookie(req.session.user, users);
  
  if (user === undefined) {
    res.status(403).redirect('/signin');
    return;
  }

  const shortURL = req.params.shortURL;

  if (urls.urls[shortURL].userID !== user.getID()) {
    res.status(403).redirect('/denied');
    return;
  }

  const longURL = req.body.longURL;
  
  urls.fixURL(shortURL, longURL);

  res.status(200).redirect('/urls');
});

app.post('/signin', (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;
  const user = users.findUserByEmail(email);
  
  if (user === undefined || !bcrypt.compareSync(pass, user.password)) {
    res.status(403).render('urls_signin', { user: undefined, invalid: true });
    return;
  } else {
    req.session.user = user.getID();
    res.redirect('/urls');
  }
});

app.post('/signout', (req, res) => {
  req.session = null;
  res.status(200).redirect('/urls');
});

app.post('/signup', (req, res) => {
  const email = req.body.email;
  const pass1 = req.body.password1;
  const pass2 = req.body.password2;
  const prevuser =  checkCookie(req.session.user, users);

  if (users.findUserByEmail(email) !== undefined) {
    res.status(400).render('urls_signup', { email: true, other: false, user: undefined });
    return;
  } else if (pass1 !== pass2 || pass1.length === 0 || email.length === 0) {
    res.status(400).render('urls_signup', { email: false, other: true, user: prevuser, });
    return;
  } else {
    const hash = bcrypt.hashSync(pass1, 10);
    const user = users.addUser(email, hash);
    req.session.user = user.getID();
    res.status(200).redirect('/urls');
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});