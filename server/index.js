const express = require('express');
const app = express();

const path = require('path');

const ships = require('./ships');
const locations = require('./locations');

app.use(express.static(path.join(__dirname, "/public")));

app.use('/ships', ships);
app.use('/locations', locations);

app.get('/', (req, res) => {
    //res.send('Welcome to Stomble REST API');
    res.sendFile(path.join(__dirname)+'/views/index.html');
});

app.listen(3000, () => console.log('Listening on port 3000..'));
