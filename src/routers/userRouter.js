import express from "express";
import {
  startGithubLogin,
  finishGithubLogin,
  logout,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
  see,
} from "../controllers/userController";
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  uploadFile,
} from "../middlewares";

const userRouter = express.Router();

userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
userRouter.get("/logout", protectorMiddleware, logout);
userRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(uploadFile.single("avatar"), postEdit);
userRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
// userRouter.get("/:id", see); // 순서 중요

export default userRouter;
