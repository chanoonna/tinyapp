const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': `http://www.lighthouselabs.ca`,
  '9sm5xK': `http://www.google.com`,
};

// Algorithm from < https://stackoverflow.com/a/19964557 >
const generateRandomString = function() {
  const code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generated =
    Array(6).fill('').map(x => code.charAt(Math.floor(Math.random() * code.length))).join('');

  const result = Object.prototype.hasOwnProperty.call(urlDatabase, generated) ? generateRandomString() : generated;
  return result;
};

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.send('Hello.');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get('/hello', (req, res) => {
  res.send('<html><body>Hello <b>World</b></body></html>\n');
});

app.get('/urls', (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  res.render('urls_new');
});

app.post('/urls', (req, res) => {
  const short = generateRandomString();
  urlDatabase[short] = req.body.longURL;
  const templateVars = { shortURL: short, longURL: urlDatabase[short] };
  res.render('urls_show', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});