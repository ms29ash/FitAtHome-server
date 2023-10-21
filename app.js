const express = require("express");
const cors = require("cors");

const foodRouter = require("./routes/food");
const authRouter = require("./routes/auth");
const categoryRouter = require("./routes/category");
const serviceRouter = require("./routes/service");
const reviewsRouter = require("./routes/reviews");
const paymentRouter = require("./routes/payment.js");
const productRouter = require("./routes/product");

const userDataRouter = require("./routes/userData.js");
//importing mongodb
const connectToMongo = require("./db");
const app = express();
app.use(cors());
app.use(express.json());

// Connecting to Database
connectToMongo();

/* Get port from environment and store in Express.*/

const port = process.env.PORT || 4000;
// app.set('port', port);

// Using Routes
app.use("/food", foodRouter);
app.use("/auth", authRouter);
app.use("/reviews", reviewsRouter);
app.use("/category", categoryRouter);
app.use("/service", serviceRouter);
app.use("/payment", paymentRouter);
app.use("/userData", userDataRouter);
app.use("/product", productRouter);

//Test route
app.get("/", (req, res) => {
  res.send("Fit At Home");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
