
const express = require('express');
const router = express.Router();

router.get('/ships', (res, req) => {
    res.setEncoding('Ships page');
})

router.get('/list', function(req, res){
    res.send('Ships list page')
})
