const express = require('express');
const router = express.Router();

// JSON objects storing ships
var ships = [
    {id: '1', name: 'A', model: 'AA', location: 'AL', status: 'D'},
    {id: '2', name: 'B', model: 'BB', location: 'BL', status: 'M'}
];

// Ships home page route
router.get('/', (req, res) => {
    res.send('Ships page');
})

// Ships list route
router.get('/list', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ships, null, 3));
})

module.exports = router;