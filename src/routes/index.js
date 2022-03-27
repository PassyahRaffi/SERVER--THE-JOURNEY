const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFiles");

const { register, login, checkAuth } = require("../controller/auth");
router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

const {
  addUsers,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  updateUserImage /* input here */
} = require("../controller/user");
router.post("/user", addUsers);
router.get("/users", getUsers);
router.get("/getUser/:id", getUser);
router.patch("/user/:id", auth, updateUser);
router.delete("/user/:id", auth, deleteUser);
/* input here */
router.patch("/user/edit/image/:id", uploadFile("image"), updateUserImage);

const {
  addPost,
  editPost,
  detailPost,
  deletePost,
  getPostUser,
  getAllPost,
  getPost,
} = require("../controller/posts");
router.get("/posts", getAllPost);
router.post("/addPost", auth, uploadFile("thumbnail"), addPost);
router.post("/editPost/:id", auth, editPost);
router.get("/detail/:id", detailPost);
router.post("/delete/:id", deletePost);
router.get("/postUser/:id", getPostUser);
router.get("/getPost/:id", getPost);

const {
  addBookmark,
  deleteBookmark,
  getBookmarkuser,
} = require("../controller/bookmark");
router.post("/addBookmark", auth, addBookmark);
router.get("/getBookmark/:id", getBookmarkuser);
router.post("/deleteBookmark", deleteBookmark);

module.exports = router;
