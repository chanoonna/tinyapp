const { generateCode } = require('../src/helper');

class TinyUser {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  };

  getID = function() {
    return this.id;
  };

  getEmail = function() {
    return this.email;
  }
};

class UserDataBase {
  constructor() {
    this.users = {};
  };

  addUser = function(email, password) {
    const id = generateCode(10, this.users);
    const user = new TinyUser(id, email, password);
    this.users[id] = user;
    return user;
  };

  delUser = function(id) {
    delete this.users[id];
  };

  fixUser = function(id, key, update) {
    this.users[id][key] = update;
  };

  getDB = function() {
    return { ...this.users };
  };

  getUser = function(id) {
    return this.users[id];
  };
  
  findUserByID = function(id) {
    Object.prototype.hasOwnProperty.call(this.users, id);
    return Object.prototype.hasOwnProperty.call(this.users, id) ? this.users[id] : undefined;
  }

  findUserByEmail = function(email) {
    for (const id in this.users) {
      if (this.users[id].email === email) {
        return this.users[id];
      }
    }
    return undefined;
  }
};

module.exports = {
  UserDataBase,
};