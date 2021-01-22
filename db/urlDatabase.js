const { generateCode } = require('../src/helper');

class URLDataBase {
  constructor() {
    this.urls = {};
  }

  addURL(longURL, userID) {
    const shortURL = generateCode(6, this.urls);
    const date = new Date().toLocaleString();

    this.urls[shortURL] = {
      longURL,
      userID,
      date,
      visited: {
        visit: 0,
        visitU: 0,
        visitors: {},
      }
    };

    return shortURL;
  }

  addVisit(shortURL) {
    this.urls[shortURL].visited.visit += 1;
  }

  addVisitU(shortURL) {
    this.urls[shortURL].visited.visit += 1;
    this.urls[shortURL].visited.visitU += 1;
  }

  getVisit(shortURL) {
    return this.urls[shortURL].visited.visit;
  }

  getVisitU(shortURL) {
    return this.urls[shortURL].visited.visitU;
  }

  getDate(shortURL) {
    return this.urls[shortURL].date;
  }

  addVisitor(shortURL, visitorID) {
    const visitTime = String(Date.now());
    this.urls[shortURL].visited.visitors[visitTime] = visitorID;
  }

  getVisitors(shortURL) {
    if (this.getVisit(shortURL) === 0) {
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
