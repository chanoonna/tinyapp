const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

class TinyUser {
  constructor(id, email, password) {
    this.id = id;
    this.email = email;
    this.password = password;
  };
};

class UserDataBase {
  constructor() {
    this.users = {};
  };

  addUser = function(email, password) {
    const id = generateCode(10, this.users);
    const exist = this.exist(email);
    
    if (exist) {
      return false;
    } else {
      const user = new TinyUser(id, email, password);
      this.users[id] = user;
    }
    return true;
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

  exist = function(email) {
    for (const id of this.users) {
      if ([id].email === email) {
        return false;
      }
    }
    return true;
  }
};

module.exports = {
  UserDataBase,
};