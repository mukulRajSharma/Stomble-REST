const express = require('express');
const router = express.Router();

// handling json post requests
router.use(express.json())


// JSON objects storing locations
var locations = [
    {id: 1, cname: 'cloudy', pname: 'alienation', capacity: 9},
    {id: 2, cname: 'foggy', pname: 'ghostnation', capacity: 10}
];

// location root page
router.get('/', (req, res) => {
    res.send('Locations page');
});

// get location by id
router.get('/:id', (req, res) => {
    if (req.params.id === 'list'){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(locations, null, 3));
    }
    const loc = locations.find(c => c.id === parseInt(req.params.id));
    if (!loc) {
        res.status(404).send('The location with given id does not exist');
        return;
    }
    res.end(JSON.stringify(loc, null, 3));
});

// post location to locations list
router.post('/', (req, res) => {
    // minimal input validation
    if (!req.body.cname || !req.body.pname || !req.body.capacity) {
        // send 400 - bad request
        res.status(400).send('cname, pname, capacity required !');
        return;
    }
    const loc = {
        id: locations.length+1,
        cname: req.body.cname,
        pname: req.body.pname,
        capacity: req.body.capacity
    };
    locations.push(loc);
    res.send(loc);
});

// delete location with given id
router.delete('/:id', (req, res) => {
    const loc = locations.find(c => c.id === parseInt(req.params.id));
    if (!loc) {
        res.status(404).send('Location with given id does not exist');
        return;
    }
    const index = locations.indexOf(loc);
    locations.splice(index, 1);

    res.send(loc);
});

module.exports = router;