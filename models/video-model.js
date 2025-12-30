const mongoose = require("mongoose");

const videoModel = mongoose.Schema({
    videoUrl : {
        type : String,
        required : true
    },
    Transcription : {
        type : String,
        default : ""
    },
    userId : {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
    },
    watchedDuration: {
      type: Number,
      default: 0,
    },
    thumbnailUrl: { 
        type: String,
        default: "" 
    },
    duration: { 
        type: Number,
        default: 0 
    },
    title: {
        type: String
    },
    status: {
        type: String,
        default: "processing"
    }
} , { timestamps : true });

const video = mongoose.model("Video", videoModel);

module.exports = video;