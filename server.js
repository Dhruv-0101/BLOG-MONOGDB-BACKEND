require("dotenv").config();
const corse = require("cors");
const passport = require("./utils/passport-config");
const express = require("express");
const cron = require("node-cron");
const cookieParser = require("cookie-parser");
const connectDB = require("./utils/connectDB");
const postRouter = require("./router/post/postsRouter");
const usersRouter = require("./router/user/usersRouter");
const categoriesRouter = require("./router/category/categoriesRouter");
const planRouter = require("./router/plan/planRouter");
const stripePaymentRouter = require("./router/stripePayment/stripePaymentRouter");
const calculateEarnings = require("./utils/calculateEarnings");
const earningsRouter = require("./router/earnings/earningsRouter");
const notificationRouter = require("./router/notification/notificationRouter");
const commentRouter = require("./router/comments/commentRouter");
// calculateEarnings();
//call the db
connectDB();
//Schedule the task to run at 00:00 on the 1st day of every month
cron.schedule(
  "0 0 1 * *",
  async () => {
    console.log("Monthly cron job: calculating earnings...");
    await calculateEarnings(); //calc earnings
  },
  {
    scheduled: true,
    timezone: "America/New_York",
  },
);

const app = express();
//! PORT
const PORT = process.env.PORT || 5000;

//Middlewares
app.use(express.json()); //Pass json data
// corse middleware
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",")
  : [
      "https://blog-monogdb-frontend.vercel.app",
      "http://localhost:5173",
      "http://localhost:3000",
    ];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true, // Allow cookies to be sent with requests
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
};
app.use(corse(corsOptions));
// Passport middleware
app.use(passport.initialize());
app.use(cookieParser()); //automattically parses the cookie
//!---Route handlers
app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/plans", planRouter);
app.use("/api/v1/stripe", stripePaymentRouter);
app.use("/api/v1/earnings", earningsRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/comments", commentRouter);

//!Not found
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found on our server" });
});
//! Error handdling middleware
app.use((err, req, res, next) => {
  //prepare the error message
  const message = err.message;
  const stack = err.stack;
  res.status(500).json({
    message,
    stack,
  });
});

//!Start the server
app.listen(PORT, console.log(`Server is up and running on port ${PORT}`));
