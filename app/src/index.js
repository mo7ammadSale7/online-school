//  استيراد المكتبات المطلوبة | import the required libraries
//  تأكد من تنزيل الوحدات المطلوبة | make sure to download the required modules
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";

import setupRoutes from "./routes/route";

// لا تنسى تحديد وظيفة الخادم | don't forget to define the server function that listens to requests
const start = async () => {
  try {
    // Connect to DB
    await mongoose.connect("mongodb://localhost/online-school", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to DB, Let's Create an app!");
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));

    console.log("App is created, Let's Setup Routes!");
    setupRoutes(app);

    const port = process.env.PORT || 4000;
    console.log(`App Routes is added, let's listen in port ${port}!`);
    app.listen(port);
  } catch (error) {
    console.error(error);
  }
};

start();
