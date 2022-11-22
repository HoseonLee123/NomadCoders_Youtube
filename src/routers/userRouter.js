import express from "express";
import {
  startGithubLogin,
  finishGithubLogin,
  logout,
  getEdit,
  postEdit,
  see,
} from "../controllers/userController";

const userRouter = express.Router();

userRouter.get("/github/start", startGithubLogin);
userRouter.get("/github/finish", finishGithubLogin);
userRouter.get("/logout", logout);
userRouter.route("/edit").get(getEdit).post(postEdit);
userRouter.get("/:id", see); // 순서 중요
export default userRouter;
