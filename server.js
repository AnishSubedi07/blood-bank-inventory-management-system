const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./config/db");

//dot config
dotenv.config();

//mongodb connection
connectDB();

//restobject
const app = express();

//middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

//routes
app.use("/api/v1/test", require("./routes/testRoutes"));
app.use("/api/v1/auth", require("./routes/authRoutes"));
app.use("/api/v1/inventory", require("./routes/inventoryRoute"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));
//port
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(
    `Node Server Running on ${process.env.DEV_MODE} Port ${process.env.PORT}`
      .bgBlue.white
  );
});
