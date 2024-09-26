const express = require("express");
const {
  createShortUrl,
  redirectToLongUrl,
} = require("../controllers/urlController");
const router = express.Router();

// Route to create a short URL
router.post("/shorten", createShortUrl);

// Route to handle redirection for the short URL
router.get("/:code", redirectToLongUrl);

module.exports = router;
