const { generateCode } = require('../src/helper');

class URLDataBase {
  constructor() {
    this.urls = {};
  }

  addURL(longURL, userID) {
    const shortURL = generateCode(6, this.urls);
    this.urls[shortURL] = { longURL, userID, };
    return shortURL;
  }
  
  delURL(shortURL) {
    delete this.urls[shortURL];
  }
  
  fixURL(shortURL, longURL) {
    this.urls[shortURL].longURL = longURL;
  }
  
  getDB() {
    return { ...this.urls };
  }
  
  getURL(shortURL) {
    return this.urls[shortURL].longURL;
  }
}

module.exports = {
  URLDataBase,
};
