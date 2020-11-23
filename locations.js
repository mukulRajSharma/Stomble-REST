const express = require('express');
const router = express.Router();

// JSON objects storing ships
var locations = [
    {id: '1', cname: 'cloudy', pname: 'alienation', capacity: 9},
    {id: '2', cname: 'foggy', pname: 'ghostnation', capacity: 10}
];

// Ships home page route
router.get('/', (req, res) => {
    res.send('Locations page');
})

// Ships list route
router.get('/list', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(locations, null, 3));
})

module.exports = router;