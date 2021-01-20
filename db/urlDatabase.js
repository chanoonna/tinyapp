const { generateCode } = require('../src/helper');

class URLDataBase {
  constructor() {
    this.urls = {};
  };

  addURL = function (longURL) {
    const url = generateCode(6, this.urls);
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
