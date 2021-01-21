const {
  generateCode,
} = require('../src/helper');

class TinyUser {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.urls = {};
  }

  getID() {
    return this.id;
  }

  getEmail() {
    return this.email;
  }

  getList() {
    return this.urls;
  }

  addURL(shortURL) {
    this.urls[shortURL] = shortURL;
  }

  delURL(shortURL) {
    delete this.urls[shortURL];
  }
}

class UserDataBase {
  constructor() {
    this.users = {};
  }

  addUser(email, password) {
    const id = generateCode(10, this.users);
    const user = new TinyUser(id, email, password);
    this.users[id] = user;
    return user;
  }

  delUser(id) {
    delete this.users[id];
  }

  fixUser(id, key, update) {
    this.users[id][key] = update;
  }

  getDB() {
    return { ...this.users };
  }

  getUser(id) {
    return this.users[id];
  }
  
  findUserByID(id) {
    return Object.prototype.hasOwnProperty.call(this.users, id) ? this.users[id] : undefined;
  }

  findUserByEmail(email) {
    let userFound = undefined;
    Object.keys(this.users).forEach(user => {
      if (this.users[user].getEmail() === email) {
        userFound = this.users[user];
      }
    });
    return userFound;
  }
}

module.exports = {
  UserDataBase,
};