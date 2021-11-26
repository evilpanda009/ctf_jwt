const express = require('express');
const path = require('path');
const app = express();

const cookieParser = require("cookie-parser");
const port = 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'))
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, '/index.html'));  
});

require('./routes')(app);

app.listen(port, () => console.log(`LISTENING ON PORT ${port}`));