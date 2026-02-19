const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { requireAuth } = require("./middleware/auth");
const { bookmarksRouter } = require("./features/bookmarks/bookmarks.routes");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/bookmarks", requireAuth, bookmarksRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

module.exports = { app };
