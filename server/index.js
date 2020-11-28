const express = require('express');
const app = express();

const ships = require('./ships');
const locations = require('./locations');

app.use('/ships', ships);
app.use('/locations', locations);

app.get('/', (req, res) => {
    res.send('Stomble RESTful API!');
});

app.listen(3000, () => console.log('Listening on port 3000..'));
