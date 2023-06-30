const express = require("express");
const router = express.Router();
const {
    getTotalLikes,
    checkLike,
    storeLikeEvent,
} = require("../controllers/likesController");

// Route for storing a Like event
router.post("/", storeLikeEvent);

// Route for checking if a user has liked a content
router.get("/:userId/:contentId", checkLike);

// Route for getting total likes for a content
router.get("/count/:contentId", getTotalLikes);

module.exports = router;
