const mongoose = require("mongoose");

const likeSchema = new mongoose.Schema({
    contentId: {
        type: String,
        required: true,
    },
    user_ids: [
        {
            type: String,
            required: true,
        },
    ],
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

const Like = mongoose.model("Like", likeSchema);

module.exports = Like;
