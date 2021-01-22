const PORT = 8080;
const bcrypt = require('bcrypt');
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const methodOverride = require('method-override');
const URLDataBaseClass = require('./db/urlDatabase');
const UserDataBaseClass = require('./db/userDatabase');

const {
  checkCookie,
  getMyList,
} = require('./src/helper');

const server = function() {
  const server = express();
  server.set('view engine', 'ejs');
  server.use(bodyParser.urlencoded({extended: true}));
  server.use(methodOverride('_method'));

  server.use(cookieSession({
    name: 'session',
    keys: ['fried chicken'],
  }));

  return server;
};

const app = server();
const urls = new URLDataBaseClass.URLDataBase();             // URL Database
const users = new UserDataBaseClass.UserDataBase();          // User Database

app.get('/urls.json', (req, res) => {
  const user = checkCookie(req.session.id, users);           // Undefined for no session or no matching session in DB, or user object for matching session

  if (!user) {
    res.status(403).redirect('/login');
    return;
  }

  const myList = getMyList(user, urls);
  res.json(myList);
});

app.get('/urls', (req, res) => {
  const user = checkCookie(req.session.id, users);

  if (!user) {
    res.status(403).redirect('/login');
    return;
  }

  const myList = getMyList(user, urls);
  const templateVars = { urls: myList, user, };
  res.render('urls_index', templateVars);
});

app.get('/u/:shortURL', (req, res) => {
  const user = checkCookie(req.session.id, users);
  const shortURL = req.params.shortURL;

  if (!Object.prototype.hasOwnProperty.call(urls.getDB(), shortURL)) {
    res.status(404).send('404 page not found');
    return;
  }

  if (!user) {
    urls.addVisit(shortURL);
    res.redirect(urls.getURL(shortURL));
    return;
  }

  urls.addVisitU(shortURL);
  urls.addVisitor(shortURL, user.getID());
  res.redirect(urls.getURL(shortURL));
});

app.get('/urls/new', (req, res) => {
  const user = checkCookie(req.session.id, users);

  if (!user) {
    res.status(403).redirect('/login');
    return;
  }

  res.render('urls_new', { user, });
});

app.get('/denied', (req, res) => {
  const user = checkCookie(req.session.id, users);

  if (!user) {
    res.status(403).redirect('/login');
    return;
  }

  res.render('urls_denied', { user, });
});

app.get('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  if (!Object.prototype.hasOwnProperty.call(urls.getDB(), shortURL)) {
    res.status(404).send('404 page not found');
    return;
  }

  const user = checkCookie(req.session.id, users);
  
  if (!user) {
    res.status(403).redirect('/login');
    return;
  }

  if (user.getID() !== urls.getDB()[shortURL].userID) {
    res.status(403).redirect('/denied');
    return;
  }
  
  const longURL = urls.getURL(shortURL);
  const visit = urls.getVisit(shortURL);
  const visitU = urls.getVisitU(shortURL);
  const visitors = urls.getVisitors(shortURL);
  const date = urls.getDate(shortURL);
  const templateVars = { shortURL, longURL, user, visit, visitU, visitors, date };
  res.render('urls_show', templateVars);
});

app.get('/signup', (req, res) => {
  const user = checkCookie(req.session.id, users);

  if (user) {
    res.render('urls_signup', { user, });
    return;
  }

  const templateVars = { user: undefined, email: false, other: false };
  res.render('urls_signup', templateVars);
});

app.get('/login', (req, res) => {
  const user = checkCookie(req.session.id, users);
  const templateVars = { user, invalid: false };
  res.render('urls_login', templateVars);
});

app.get('*', (req, res) => {
  res.status(404).send('404 page not found');
});

app.post('/urls', (req, res) => {
  const user = checkCookie(req.session.id, users);
  
  if (!user) {
    res.status(403).redirect('/login');
    return;
  }

  const longURL = req.body.longURL;
  const shortURL = urls.addURL(longURL, user.getID());
  user.addURL(shortURL);

  res.redirect(`/urls/${shortURL}`);
});

app.delete('/urls/:shortURL', (req, res) => {
  const user = checkCookie(req.session.id, users);
  
  if (!user) {
    res.status(403).redirect('/login');
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

app.patch('/urls/:shortURL', (req, res) => {
  const user = checkCookie(req.session.id, users);
  
  if (!user) {
    res.status(403).redirect('/login');
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

app.post('/login', (req, res) => {
  const email = req.body.email;
  const pass = req.body.password;
  const user = users.findUserByEmail(email);
  
  if (!user) {
    res.status(401).render('urls_login', { user, invalid: true });
    return;
  }
  
  bcrypt.compare(pass, user.password)
    .then(result => {
      if (!result) {
        res.status(401).render('urls_login', { user: undefined, invalid: true });
        return;
      }
      req.session.id = user.getID();
      res.status(200).redirect('/urls');
    });
});

app.delete('/logout', (req, res) => {
  req.session = null;
  res.status(200).redirect('/urls');
});

app.post('/signup', (req, res) => {
  const email = req.body.email;
  const pass1 = req.body.password1;
  const pass2 = req.body.password2;
  const prevuser =  checkCookie(req.session.id, users);

  if (users.findUserByEmail(email) !== undefined) {
    res.status(400).render('urls_signup', { email: true, other: false, user: undefined });
    return;
  }
  if (pass1 !== pass2 || pass1.length === 0 || email.length === 0) {
    res.status(400).render('urls_signup', { email: false, other: true, user: prevuser, });
    return;
  }

  bcrypt.hash(pass1, 10, (err, hash) => {
    if (err) {
      res.status(500).send('Unexpected error.');
      return;
    }

    const user = users.addUser(email, hash);
    req.session.id = user.getID();
    res.status(200).redirect('/urls');
  });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
