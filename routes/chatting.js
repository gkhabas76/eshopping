//Creating a Chat route
const express = require('express');
const router = express.Router();

router.get('/chat', function(req, res, next){
    res.render('chat/chat');
});

module.exports = router;