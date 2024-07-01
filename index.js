const myConfigs = require("./conf/conf");
const corsConfig = require("./conf/corsConfig");
const path = require("path");
const express = require("express");
const connectToDB = require("./dbConfig/connection");
const authRouter = require("./routes/client/auth.route");
const clientRouter = require("./routes/client/blog.route");
const userRouter = require("./routes/client/user.route");
const cors = require("cors");
const { authMiddleware } = require("./middlewares/auth.middleware");

//Adding this line for Git Activity

//Created an express app
const app = express();

//Connection with DB
connectToDB(myConfigs.mongoDBUrl);

//Middlewares
app.use(cors(corsConfig));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.resolve("public/")));

//Client Side Auth Router
app.use("/api", authRouter);

//Client Side Blogs Router
app.use("/api", authMiddleware, clientRouter);

//Client Side Users Router
app.use("/api", authMiddleware, userRouter);

//Started to listen the server
app.listen(myConfigs.port, () =>
  console.log(`Server is Started at PORT: ${myConfigs.port}`)
);
