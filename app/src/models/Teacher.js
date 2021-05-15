// في هذا الملف ، قم بإعداد وحدة المستخدم (المدرس) الخاصة بك | in this file, set up your user module
// 1. قم باستيراد مكتبة moongoose | import the mongoose library
import { Schema, model } from "mongoose";
import shortId from "shortid";

import { hashPassword } from "../helper";

// 2. قم بتحديد مخطط المدرس | start defining your user schema
const TeacherSchema = new Schema({
  name: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  salt: String,
});

// تخزين كلمة السر بعد عمل الهاش
TeacherSchema.pre("save", function (next) {
  if (!this.salt) {
    this.salt = shortId.generate();
  }
  if (this.password) {
    this.password = hashPassword(this.password, this.salt);
  }
  next();
});

// 3. إنشاء نموذج المدرس | create  the user model
const TeacherModel = model("Teacher", TeacherSchema);

// 4. تصدير الوحدة | export the module
export default TeacherModel;
