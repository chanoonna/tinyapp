// Algorithm from < https://stackoverflow.com/a/19964557 >
// Generates random code with given number of length and checks duplication in DB
const generateCode = function(length, db) {
  const code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generated =
    Array(length).fill('').map(() => code.charAt(Math.floor(Math.random() * code.length))).join('');

  const result = Object.prototype.hasOwnProperty.call(db, generated) ? generateCode() : generated;
  return result;
};

// Check if cookie exists.
const checkCookie = function(idInSession, users) {
  if (!idInSession || users.findUserByID(idInSession) === undefined) {
    return undefined;
  }

  return users.getUser(idInSession);
};

// Parse db for My URL
const getMyList = function(user, db) {
  const list = {};
  Object.keys(user.getList()).forEach(url => list[url] = { longURL: db.getURL(url), visit: db.getVisit(url), visitU: db.getVisitU(url), date: db.getDate(url), });
  return list;
};

module.exports = {
  generateCode,
  checkCookie,
  getMyList,
};
