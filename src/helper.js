// Algorithm from < https://stackoverflow.com/a/19964557 >
const generateCode = function(length, db) {
  const code = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const generated =
    Array(length).fill('').map(x => code.charAt(Math.floor(Math.random() * code.length))).join('');

  const result = Object.prototype.hasOwnProperty.call(db, generated) ? generateCode() : generated;
  return result;
};

const checkCookie = function(cookie) {
  if (!cookie) {
    return undefined;
  }

  return cookie;
};

module.exports = {
  generateCode,
};
