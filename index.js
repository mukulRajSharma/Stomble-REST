const express = require('express');
const app = express();

const shipRoutes = require('./ships');
app.use('/ships', shipRoutes);


module.exports = app;

app.get('/', (req, res) => {
    res.send('Stomble RESTful API!');
});

app.get('/api/ships', (req, res) => {
    res.send([1,2,3]);
});

app.get('/ships', app.list);


app.listen(3000, () => console.log('Listening on port 3000..'));
