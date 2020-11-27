const express = require('express');
const fs = require('fs');

const router = express.Router();

// handling json post requests
router.use(express.json())

router.get('/', (req, res) => {
    res.send('Locations page');
});

// get location by id
router.get('/:id', (req, res) => {

    // read the locations file
    let rawLoc = fs.readFileSync('./data/locations.json');
    let jLoc = JSON.parse(rawLoc);
    
    // listing all locations
    if (req.params.id === 'list'){
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(jLoc, null, 3));
        return;
    }
    
    // listing location by ids
    const loc = jLoc.find(c => c.id === parseInt(req.params.id));
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
    // load the locations file
    let rawLoc = fs.readFileSync('./data/locations.json');
    let jLoc = JSON.parse(rawLoc);

    // make JSON object to be pushed to file
    let loc = {
        id: jLoc.length+1,
        cname: req.body.cname,
        pname: req.body.pname,
        capacity: req.body.capacity
    };

    // write the changes back to the file
    jLoc.push(loc);
    fs.writeFileSync('./data/locations.json', JSON.stringify(jLoc));

    res.send(loc);
});

// delete location with given id
router.delete('/:id', (req, res) => {
    // load the locations file
    let rawLoc = fs.readFileSync('./data/locations.json');
    let jLoc = JSON.parse(rawLoc);

    // find the location with given id
    const loc = jLoc.find(c => c.id === parseInt(req.params.id));
    if (!loc) {
        res.status(404).send('Location with given id does not exist');
        return;
    }
    
    // check if there are any ships at this location
    // if yes, then remove or delte them before deleting lcoation

    let rawShip = fs.readFileSync('./data/ships.json');
    let jShip = JSON.parse(rawShip);

    const ship = jShip.find(c => loc.cname===c.location[0] && loc.pname===c.location[1]);
    if (ship) return res.status(400).send('Location has ships parked, remove or delete ships before deleting location!');

    // remove element from the JSON locations list
    const index = jLoc.indexOf(loc);
    jLoc.splice(index, 1);

    // write the changes back to the file
    fs.writeFileSync('./data/locations.json', JSON.stringify(jLoc));
    res.send(loc);
});

module.exports = router;