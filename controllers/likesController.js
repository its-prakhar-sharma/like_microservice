const Like = require("../models/likeModel");
const asyncHandler = require("express-async-handler");
const Redis = require("ioredis");
const cache = new Redis({
    host: process.env.REDIS_URL,
});

// Store a Like event
const storeLikeEvent = asyncHandler(async (req, res) => {
    console.log(req.body);
    const user_id = req.body.user_id;
    const content_id = req.body.content_id;

    try {
        const existingLike = await Like.findOne({ content_id });

        if (existingLike) {
            // If the content already has Likes, check if the user has already liked it
            const userIndex = existingLike.user_ids.indexOf(user_id);

            if (userIndex === -1) {
                // If the user hasn't liked the content, add their user_id to the user_ids array
                existingLike.user_ids.push(user_id);
                await existingLike.save();

                // Check if the total likes reach 100
                if (existingLike.user_ids.length === 100) {
                    // Placeholder code to log a message instead of sending actual push notification
                    console.log(
                        `Content with ID ${content_id} has reached 100 likes.`
                    );
                }
            } else {
                // If the user has already liked the content, remove their user_id from the user_ids array
                existingLike.user_ids.splice(userIndex, 1);
                await existingLike.save();
                return res
                    .status(200)
                    .json({ message: "UnLiked successfully" });
            }
        } else {
            // If the content has no existing Likes, create a new Like entry
            await Like.create({ content_id, user_ids: [user_id] });
        }

        return res
            .status(200)
            .json({ message: "Like event stored successfully" });
    } catch (error) {
        console.error("Error on storing Like event", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Check if a user has liked a content
const checkLike = asyncHandler(async (req, res) => {
    const { user_id, content_id } = req.params;

    try {
        // Check if the content has any existing Likes
        const existingLike = await Like.findOne({ content_id });

        if (existingLike && existingLike.user_ids.includes(user_id)) {
            return res.status(200).json({ liked: true });
        } else {
            return res.status(200).json({ liked: false });
        }
    } catch (error) {
        console.error("Error on checking Like", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

// Get total likes for a content
const getTotalLikes = asyncHandler(async (req, res) => {
    const { content_id } = req.params;

    try {
        const cacheKey = `totalLikes_${req.params.content_id}`;

        // Check if the result is available in cache
        const cachedResult = await cache.get(cacheKey);
        if (cachedResult) {
            return res.status(200).json({ totalLikes: parseInt(cachedResult) });
        }

        // Count the number of Likes for the given content
        const totalLikes = await Like.countDocuments({ content_id });
        if (!totalLikes) {
            return res.status(200).json({ message: "No Likes Found" });
        }

        // Store the result in cache
        await cache.set(cacheKey, totalLikes);

        return res.status(200).json({ totalLikes });
    } catch (error) {
        console.error("Error fetching total likes", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = { getTotalLikes, checkLike, storeLikeEvent };
