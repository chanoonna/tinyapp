// Algorithm from < https://stackoverflow.com/a/19964557 >
const generateCode = function(length, db) {
  const code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generated =
    Array(length).fill('').map(() => code.charAt(Math.floor(Math.random() * code.length))).join('');

  const result = Object.prototype.hasOwnProperty.call(db, generated) ? generateCode() : generated;
  return result;
};

const checkCookie = function(cookie, users) {
  if (!cookie || users.findUserByID(cookie) === undefined) {
    return undefined;
  }

  return users.getUser(cookie);
};

const getMyList = function(user, db) {
  const list = {};
  Object.keys(user.getList()).forEach(url => list[url] = db.getURL(url));
  return list;
};

module.exports = {
  generateCode,
  checkCookie,
  getMyList,
};
