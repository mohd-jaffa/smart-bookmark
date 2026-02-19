const {
  listBookmarks,
  createBookmark,
  deleteBookmark,
  incrementVisitCount
} = require("./bookmarks.service");

const getBookmarks = async (req, res) => {
  const { data, error } = await listBookmarks(req.user.id);
  if (error) {
    // eslint-disable-next-line no-console
    console.error("List bookmarks error:", error);
    return res.status(500).json({ message: error.message, details: error.details, hint: error.hint });
  }
  return res.json(data);
};

const addBookmark = async (req, res) => {
  const { title, url } = req.body || {};
  if (!title || !url) {
    return res.status(400).json({ message: "Title and URL are required" });
  }

  const { data, error } = await createBookmark(req.user.id, { title, url });
  if (error) {
    // eslint-disable-next-line no-console
    console.error("Create bookmark error:", error);
    return res.status(500).json({ message: error.message, details: error.details, hint: error.hint });
  }

  return res.status(201).json(data);
};

const removeBookmark = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await deleteBookmark(req.user.id, id);
  if (error) {
    // eslint-disable-next-line no-console
    console.error("Delete bookmark error:", error);
    return res.status(500).json({ message: error.message, details: error.details, hint: error.hint });
  }
  if (!data) {
    return res.status(404).json({ message: "Bookmark not found" });
  }
  return res.json({ id: data.id });
};

const trackVisit = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await incrementVisitCount(req.user.id, id);
  if (error) {
    // eslint-disable-next-line no-console
    console.error("Track visit error:", error);
    return res.status(500).json({ message: error.message });
  }
  return res.json({ success: true, data });
};

module.exports = {
  getBookmarks,
  addBookmark,
  removeBookmark,
  trackVisit
};
