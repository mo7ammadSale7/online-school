// في هذا الملف ، قم بإعداد طرق التطبيق الخاصة بك | in this file, set up your application routes
import Joi from "joi";
import jwt from "jsonwebtoken";

import { hashPassword } from "../helper";

// 1. استيراد وحدةالمدرس | import the teacher module
import TeacherModel from "../models/Teacher";

// 2. استيراد وحدة الطالب | import the student module
import StudentModel from "../models/Student";

const permessionFunc = async () => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      res.statusCode = 401;
      res.send("You Have No Permissions!");
      return;
    }

    const decodedToken = jwt.decode(token);
    const teacher = await TeacherModel.findById(decodedToken.sub);

    if (!teacher) {
      res.statusCode = 401;
      res.send("You Have No Permissions!");
      return;
    }

    jwt.verify(token, teacher.salt);
  } catch (error) {
    res.statusCode = 401;
    res.send(error.message);
  }
};

const setupRoutes = (app) => {
  // 3. تسجيل مدرس جديد و تخزين بياناته | new teacher sign up
  app.post("/teacher/register", async (req, res) => {
    const { name, email, password } = req.body;
    const bodySchema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });
    const validationResult = bodySchema.validate(req.body);
    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }
    try {
      const newTeacher = new TeacherModel({
        name,
        email,
        password,
      });
      await newTeacher.save();
      res.send(newTeacher);
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });

  // 4. تسجيل دخول مدرس و ارجاع التوكن | teacher login and response with jwt token
  app.post("/teacher/login", async (req, res) => {
    const { email, password } = req.body;

    const teacher = await TeacherModel.findOne({ email });
    if (!teacher) {
      res.statusCode = 401;
      res.send("No teacher Found!");
    } else {
      if (teacher.password === hashPassword(password, teacher.salt)) {
        const token = jwt.sign({ sub: teacher._id }, teacher.salt, {
          expiresIn: "30m",
        });
        res.send(token);
      } else {
        res.statusCode = 401;
        res.send(`${teacher.name} Your password is wrong!`);
      }
    }
  });

  // 5. إعداد طرق مختلفة | setup the different routes (get, post, put, delete)
  app.get("/students", async (req, res) => {
    permessionFunc();
    const students = await StudentModel.find({});
    res.send(students);
  });

  // Add student => POST
  app.post("/students", async (req, res) => {
    permessionFunc();
    const { name, birthdate, city, email } = req.body;
    const bodySchema = Joi.object({
      name: Joi.string().required(),
      birthdate: Joi.string().required(),
      city: Joi.string().required(),
      email: Joi.string().email().required(),
    });
    const validationResult = bodySchema.validate(req.body);
    if (validationResult.error) {
      res.statusCode = 400;
      res.send(validationResult.error.details[0].message);
      return;
    }
    try {
      const newStudent = new StudentModel({
        name,
        birthdate,
        city,
        email,
      });
      await newStudent.save();
      res.json({ message: `${newStudent.name} has success Added!` });
    } catch (error) {
      res.statusCode = 400;
      res.send(error.message);
    }
  });

  // Show student By ID => GET
  app.get("/students/:id", async (req, res) => {
    permessionFunc();
    const id = req.params.id;
    const student = await StudentModel.findById(id);
    res.send(student);
  });

  // Update student By ID => PUT
  app.put("/students/:id", async (req, res) => {
    permessionFunc();
    const id = req.params.id;
    const studentInfo = {
      name: req.body.name,
      birthdate: req.body.birthdate,
      city: req.body.city,
    };
    const student = await StudentModel.findByIdAndUpdate(id, {
      $set: studentInfo,
    });
    res.json({ message: `${student.name} has success Updated!` });
  });

  // Delete student By ID => DELETE
  app.delete("/students/:id", async (req, res) => {
    permessionFunc();
    const id = req.params.id;
    const student = await StudentModel.findByIdAndRemove(id);
    res.json({ message: `${student.name} has success Deleted!` });
  });

  // Get Not Found Page
  app.get("*", (req, res) => res.send("Not Found!"));
};

// 3. تصدير الوحدة | export the module
export default setupRoutes;
