const express = require('express');
const router = express.Router();
const videoModel = require('../models/video-model');
const { route } = require('./user-router');

router.get('/videos', async (req, res) => {
    const id = req.user._id;
    const videoList = await videoModel.find( { userId : id } );
    return res.status(200).send(videoList);
});

module.exports = router;