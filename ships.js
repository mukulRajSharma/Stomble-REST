const express = require('express');
const router = express.Router();

// handling json post requests
router.use(express.json());


// JSON objects storing ships
var ships = [
    {id: 1, name: 'A', model: 'AA', location: ['cloudy', 'alienation'], status: 'D'},
    {id: 2, name: 'B', model: 'BB', location: ['foggy', 'ghostnation'], status: 'M'}
];

// get ships root page
router.get('/', (req, res) => {
    res.send('Ships page');
})

// get ship by id
router.get('/:id', (req, res) => {
    // to list all ships
    if (req.params.id === 'list'){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(ships, null, 3));
    }
    const ship = ships.find(c => c.id === parseInt(req.params.id));
    if(!ships) res.status(404).send('Ship with the given id does not exist');
    res.end(JSON.stringify(ship, null, 3));
});

// get Ships list
router.get('/list', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(ships, null, 3));
})

// post ship to ships list
router.post('/', (req, res) => {
    // minimal input validation
    if (!req.body.name || !req.body.model || !req.body.location || !req.body.status){
        res.status(400).send('name, model, location, capacity are required!');
        return;
    }
    
    const ship = {
        id: ships.length+1,
        name: req.body.name,
        model: req.body.model,
        location: req.body.location,
        status: req.body.status
    };
    ships.push(ship);
    res.send(ship);
});

module.exports = router;
