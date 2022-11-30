import User from "../models/User";
import Video from "../models/Video";

// rootRouter
export const home = async (req, res) => {
  const video = await Video.find({}).sort({ createdAt: "desc" });
  return res.render("home", { pageTitle: "Home", video });
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let video = [];
  if (keyword) {
    video = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search", video });
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
  return res.render("video/watch.pug", {
    pageTitle: video.title,
    video,
  });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res
      .status(404)
      .render("404.pug", { pageTitle: "Video not found 😕" });
  }
  return res.render("video/edit.pug", {
    pageTitle: `Edit ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res
      .status(404)
      .render("404.pug", { pageTitle: "Video not found 😕" });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/video/${id}`);
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findByIdAndDelete(id);
  return res.redirect("/");
};

export const getUpload = (req, res) => {
  return res.render("video/upload.pug", { pageTitle: "Upload a video" });
};
export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { path: fileUrl } = req.file;
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      fileUrl,
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
  } catch (error) {
    return res.status(400).render("upload.pug", {
      pageTitle: "Upload a video",
      errorMessage: error._message,
    });
  }
  return res.redirect("/");
};
