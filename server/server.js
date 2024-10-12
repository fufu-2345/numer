const express = require('express');
const app = express();

const port =5000;


app.get('/', (req, res) => {
    res.json('testtt123');
});



app.listen(port,() => {console.log(`port ${port} is updated/started`)})

