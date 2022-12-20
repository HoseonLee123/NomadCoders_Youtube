import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middlewares";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import flash from "express-flash";

const app = express(); // Create a server

app.set("view engine", "pug"); // pug를 뷰엔진으로 사용
app.set("views", process.cwd() + "/src/views"); // pug파일들을 잘 찾을 수 있게 경로 세팅

app.use(morgan("dev"));

app.use(express.urlencoded({ extended: true })); // form의 값들을 이해할 수 있도록 설정

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
); // session 생성 user 기억
app.use(flash());
app.use(localsMiddleware); // res.locals object 생성
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/uploads", express.static("uploads")); // Connect Express with the folder
app.use("/assets", express.static("assets")); // Connect Express with the folder
app.use("/api", apiRouter);

export default app;
