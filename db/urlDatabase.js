const urlDatabase = {
  'b2xVn2': `http://www.lighthouselabs.ca`,
  '9sm5xK': `http://www.google.com`,
};

// Algorithm from < https://stackoverflow.com/a/19964557 >
const getRandomStr = function generateRandomString() {
  const code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generated =
    Array(6).fill('').map(x => code.charAt(Math.floor(Math.random() * code.length))).join('');

  const result = Object.prototype.hasOwnProperty.call(urlDatabase, generated) ? generateRandomString() : generated;
  return result;
};

const addURL = function addNewURLtoDatabase(longURL) {
  const url = getRandomStr();
  urlDatabase[url] = longURL;
  return url;
};

const delURL = function deleteURLFromDatabase(shortURL) {
  delete urlDatabase[shortURL];
};

const fixURL = function updateExistingURL(shortURL, longURL) {
  urlDatabase[shortURL] = longURL;
}

const getDB = function getWholeDatabase() {
  const returnObject = { ...urlDatabase };
  return returnObject;
};

const getURL = function getLongURLWithShortURL(shortURL) {
  return urlDatabase[shortURL];
};

module.exports = {
  getDB,
  getURL,
  addURL,
  delURL,
  fixURL,
};
