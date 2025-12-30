const express = require("express");
const router = express.Router();
const multer = require("multer");
const { createClient } = require("@supabase/supabase-js");
const videoModel = require("../models/video-model");
const fs = require("fs");
const path = require("path");

const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("ffmpeg-static");
const ffprobePath = require("ffprobe-static");

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath.path);

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("video"), async (req, res) => {
  let tempVideoPath = "";
  let tempThumbPath = "";

  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const cleanFileName = file.originalname.replace(/\s+/g, '_');
    const baseName = `${Date.now()}_${cleanFileName}`;
    const videoFileName = baseName;
    const thumbFileName = `thumb_${baseName}.jpg`;

    const tempDir = path.join(__dirname, "../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    tempVideoPath = path.join(tempDir, videoFileName);
    tempThumbPath = path.join(tempDir, thumbFileName);

    fs.writeFileSync(tempVideoPath, file.buffer);

    const duration = await new Promise((resolve, reject) => {
        ffmpeg.ffprobe(tempVideoPath, (err, metadata) => {
            if (err) return reject(err);
            resolve(metadata.format.duration); 
        });
    });

    await new Promise((resolve, reject) => {
      ffmpeg(tempVideoPath)
        .screenshots({
          timestamps: ["00:00:01.000"],
          filename: thumbFileName,
          folder: tempDir,
          size: "320x?",
        })
        .on("end", resolve)
        .on("error", reject);
    });

    const { error: videoErr } = await supabase.storage
        .from("videos").upload(videoFileName, file.buffer, { contentType: file.mimetype });
    if (videoErr) throw videoErr;

    const thumbBuffer = fs.readFileSync(tempThumbPath);
    const { error: thumbErr } = await supabase.storage
        .from("videos").upload(thumbFileName, thumbBuffer, { contentType: "image/jpeg" });
    if (thumbErr) throw thumbErr;

    const { data: vUrl } = supabase.storage.from("videos").getPublicUrl(videoFileName);
    const { data: tUrl } = supabase.storage.from("videos").getPublicUrl(thumbFileName);

    const newVideo = await videoModel.create({
      videoUrl: vUrl.publicUrl,
      thumbnailUrl: tUrl.publicUrl,
      duration: duration,
      userId: req.user._id,
      title: cleanFileName
    });

    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
    if (fs.existsSync(tempThumbPath)) fs.unlinkSync(tempThumbPath);

    return res.json({ msg: "Success", video: newVideo });

  } catch (err) {
    console.error(err);
    if (fs.existsSync(tempVideoPath)) fs.unlinkSync(tempVideoPath);
    if (fs.existsSync(tempThumbPath)) fs.unlinkSync(tempThumbPath);
    res.status(500).json({ error: err.message });
  }
});

router.post("/update", async (req, res) => {
  try {
    const { url, transcript } = req.body;

    if (!url || !transcript) {
      return res.status(400).json({ msg: "url and transcript are required" });
    }

    const updatedVideo = await videoModel.findOneAndUpdate(
      { videoUrl : url },
      { $set: { Transcription: transcript } },
      { new: true }
    );

    if (!updatedVideo) {
      return res.status(404).json({ msg: "Video not found" });
    }

    res.status(200).json({
      msg: "Updated successfully",
      video: updatedVideo
    });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


router.post("/exist", async (req, res) => {
  try {
    const { videoUrl } = req.body;

    if (!videoUrl) {
      return res.status(400).json({ msg: "videoUrl is required" });
    }

    const existingVideo = await videoModel.findOne({ videoUrl });

    if (!existingVideo) {
      return res.status(404).json({ msg: "Video not found" });
    }

    if (!existingVideo.transcription) {
      return res.status(404).json({ msg: "Transcription not found" });
    }

    return res.status(200).json({
      transcript: existingVideo.transcription
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "Server error" });
  }
});

router.post("/details", async (req , res) => {
  const videoId = req.body.video ;
  
  const existingVideo = await videoModel.findOne({_id : videoId}) ;
  
  if(!existingVideo) {
    return res.status(404).send({ msg : "Unauthorized Access"} );
  }
  return res.status(200).send(existingVideo) ;
});

module.exports = router;