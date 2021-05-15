"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hashPassword = void 0;

var _crypto = _interopRequireDefault(require("crypto"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const hashPassword = function hashPassword(password) {
  let salt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "secret";
  return _crypto.default.createHmac("sha256", salt).update(password).digest("hex");
};

exports.hashPassword = hashPassword;