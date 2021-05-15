"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = require("mongoose");

var _shortid = _interopRequireDefault(require("shortid"));

var _helper = require("../helper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// في هذا الملف ، قم بإعداد وحدة المستخدم (المدرس) الخاصة بك | in this file, set up your user module
// 1. قم باستيراد مكتبة moongoose | import the mongoose library
// 2. قم بتحديد مخطط المدرس | start defining your user schema
const TeacherSchema = new _mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String,
  salt: String
}); // تخزين كلمة السر بعد عمل الهاش

TeacherSchema.pre("save", function (next) {
  if (!this.salt) {
    this.salt = _shortid.default.generate();
  }

  if (this.password) {
    this.password = (0, _helper.hashPassword)(this.password, this.salt);
  }

  next();
}); // 3. إنشاء نموذج المدرس | create  the user model

const TeacherModel = (0, _mongoose.model)("Teacher", TeacherSchema); // 4. تصدير الوحدة | export the module

var _default = TeacherModel;
exports.default = _default;