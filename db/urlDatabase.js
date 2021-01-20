const urlDatabase = {
  'b2xVn2': `http://www.lighthouselabs.ca`,
  '9sm5xK': `http://www.google.com`,
};

// Algorithm from < https://stackoverflow.com/a/19964557 >
const generateCode = function generateRandomString() {
  const code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generated =
    Array(6).fill('').map(x => code.charAt(Math.floor(Math.random() * code.length))).join('');

  const result = Object.prototype.hasOwnProperty.call(urlDatabase, generated) ? generateRandomString() : generated;
  return result;
};

class URLDataBase {
  constructor() {
    this.urls = {};
  };

  addURL = function (longURL) {
    const url = generateCode();
    this.urls[url] = longURL;
    return url;
  };
  
  delURL = function (shortURL) {
    delete this.urls[shortURL];
  };
  
  fixURL = function (shortURL, longURL) {
    this.urls[shortURL] = longURL;
  }
  
  getDB = function () {
    return { ...this.urls };
  };
  
  getURL = function (shortURL) {
    return this.urls[shortURL];
  };
};

module.exports = {
  URLDataBase,
};
