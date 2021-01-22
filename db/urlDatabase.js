const { generateCode } = require('../src/helper');

class URLDataBase {
  constructor() {
    this.urls = {};
  }

  addURL(longURL, userID) {
    const shortURL = generateCode(6, this.urls);

    this.urls[shortURL] = {
      longURL,
      userID,
      visited: {
        count: 0,
        visitors: {},
      }
    };

    return shortURL;
  }

  addCount(shortURL) {
    this.urls[shortURL].visited.count += 1;
  }

  getCount(shortURL) {
    return this.urls[shortURL].visited.count;
  }

  addVisitor(shortURL, visitorID) {
    const visitTime = String(Date.now());
    this.urls[shortURL].visited.visitors[visitTime] = visitorID;
  }

  getVisitors(shortURL) {
    if (this.getCount(shortURL) === 0) {
      return undefined;
    }

    return this.urls[shortURL].visited.visitors;
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
    return Object.prototype.hasOwnProperty.call(this.urls, shortURL) ? this.urls[shortURL].longURL : undefined;
  }
}

module.exports = {
  URLDataBase,
};
