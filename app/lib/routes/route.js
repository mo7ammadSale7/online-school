"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _joi = _interopRequireDefault(require("joi"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _helper = require("../helper");

var _Teacher = _interopRequireDefault(require("../models/Teacher"));

var _Student = _interopRequireDefault(require("../models/Student"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// في هذا الملف ، قم بإعداد طرق التطبيق الخاصة بك | in this file, set up your application routes
// 1. استيراد وحدةالمدرس | import the teacher module
// 2. استيراد وحدة الطالب | import the student module
const permessionFunc = async () => {
  try {
    const token = req.headers.authorization;

    if (!token) {
      res.statusCode = 401;
      res.send("You Have No Permissions!");
      return;
    }

    const decodedToken = _jsonwebtoken.default.decode(token);

    const teacher = await _Teacher.default.findById(decodedToken.sub);

    if (!teacher) {
      res.statusCode = 401;
      res.send("You Have No Permissions!");
      return;
    }

    _jsonwebtoken.default.verify(token, teacher.salt);
  } catch (error) {
    res.statusCode = 401;
    res.send(error.message);
  }
};

const setupRoutes = app => {
  // 3. تسجيل مدرس جديد و تخزين بياناته | new teacher sign up
  app.post("/teacher/register", async (req, res) => {
    const {
      name,
      email,
      password
    } = req.body;

    const bodySchema = _joi.default.object({
      name: _joi.default.string().required(),
      email: _joi.default.string().email().required(),
      password: _joi.default.string().min(6).required()
    });

    const validationResult = bodySchema.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }

    try {
      const newTeacher = new _Teacher.default({
        name,
        email,
        password
      });
      await newTeacher.save();
      res.send(newTeacher);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  }); // 4. تسجيل دخول مدرس و ارجاع التوكن | teacher login and response with jwt token

  app.post("/teacher/login", async (req, res) => {
    const {
      email,
      password
    } = req.body;
    const teacher = await _Teacher.default.findOne({
      email
    });

    if (!teacher) {
      res.statusCode = 401;
      res.send("No teacher Found!");
    } else {
      if (teacher.password === (0, _helper.hashPassword)(password, teacher.salt)) {
        const token = _jsonwebtoken.default.sign({
          sub: teacher._id
        }, teacher.salt, {
          expiresIn: "30m"
        });

        res.send(token);
      } else {
        res.statusCode = 401;
        res.send("".concat(teacher.name, " Your password is wrong!"));
      }
    }
  }); // 5. إعداد طرق مختلفة | setup the different routes (get, post, put, delete)

  app.get("/students", async (req, res) => {
    permessionFunc();
    const students = await _Student.default.find({});
    res.send(students);
  }); // Add student => POST

  app.post("/students", async (req, res) => {
    permessionFunc();
    const {
      name,
      birthdate,
      city,
      email
    } = req.body;

    const bodySchema = _joi.default.object({
      name: _joi.default.string().required(),
      birthdate: _joi.default.string().required(),
      city: _joi.default.string().required(),
      email: _joi.default.string().email().required()
    });

    const validationResult = bodySchema.validate(req.body);

    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }

    try {
      const newStudent = new _Student.default({
        name,
        birthdate,
        city,
        email
      });
      await newStudent.save();
      res.json({
        message: "".concat(newStudent.name, " has success Added!")
      });
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  }); // Show student By ID => GET

  app.get("/students/:id", async (req, res) => {
    permessionFunc();
    const id = req.params.id;
    const student = await _Student.default.findById(id);
    res.send(student);
  }); // Update student By ID => PUT

  app.put("/students/:id", async (req, res) => {
    permessionFunc();
    const id = req.params.id;
    const studentInfo = {
      name: req.body.name,
      birthdate: req.body.birthdate,
      city: req.body.city
    };
    const student = await _Student.default.findByIdAndUpdate(id, {
      $set: studentInfo
    });
    res.json({
      message: "".concat(student.name, " has success Updated!")
    });
  }); // Delete student By ID => DELETE

  app.delete("/students/:id", async (req, res) => {
    permessionFunc();
    const id = req.params.id;
    const student = await _Student.default.findByIdAndRemove(id);
    res.json({
      message: "".concat(student.name, " has success Deleted!")
    });
  }); // Get Not Found Page

  app.get("*", (req, res) => res.send("Not Found!"));
}; // 3. تصدير الوحدة | export the module


var _default = setupRoutes;
exports.default = _default;