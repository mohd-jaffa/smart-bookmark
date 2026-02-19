const express = require("express");
const {
  getBookmarks,
  addBookmark,
  removeBookmark,
  trackVisit
} = require("./bookmarks.controller");

const router = express.Router();

router.get("/", getBookmarks);
router.post("/", addBookmark);
router.delete("/:id", removeBookmark);
router.post("/:id/visit", trackVisit);

module.exports = { bookmarksRouter: router };
