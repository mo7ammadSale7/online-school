"use strict";

var _express = _interopRequireDefault(require("express"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _route = _interopRequireDefault(require("./routes/route"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//  استيراد المكتبات المطلوبة | import the required libraries
//  تأكد من تنزيل الوحدات المطلوبة | make sure to download the required modules
// لا تنسى تحديد وظيفة الخادم | don't forget to define the server function that listens to requests
const start = async () => {
  try {
    // Connect to DB
    await _mongoose.default.connect("mongodb://localhost/online-school", {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("Connected to DB, Let's Create an app!");
    const app = (0, _express.default)();
    app.use(_bodyParser.default.urlencoded({
      extended: true
    }));
    console.log("App is created, Let's Setup Routes!");
    (0, _route.default)(app);
    const port = process.env.PORT || 4000;
    console.log("App Routes is added, let's listen in port ".concat(port, "!"));
    app.listen(port);
  } catch (error) {
    console.error(error);
  }
};

start();