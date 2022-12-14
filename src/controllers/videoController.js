import User from "../models/User";
import Video from "../models/Video";

// rootRouter
export const home = async (req, res) => {
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};

// videoRouter
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner");
  if (!video) {
    return res
      .status(404)
      .render("404.pug", { pageTitle: "Video not found 😕" });
  }
  return res.render("videos/watch.pug", {
    pageTitle: video.title,
    video,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const {
    user: { _id },
  } = req.session;
  if (!video) {
    return res
      .status(404)
      .render("404.pug", { pageTitle: "Video not found 😕" });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  return res.render("videos/edit.pug", {
    pageTitle: `Edit ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404.pug", { pageTitle: "Video not found 😕" });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  const {
    user: { _id },
  } = req.session;
  const user = await User.findById(_id);
  if (!video) {
    return res
      .status(404)
      .render("404.pug", { pageTitle: "Video not found 😕" });
  }
  if (String(video.owner) !== _id) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("videos/upload.pug", { pageTitle: "Upload a video" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      fileUrl,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
  } catch (error) {
    return res.status(400).render("upload.pug", {
      pageTitle: "Upload a video",
      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};

// apiRouter
export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};
