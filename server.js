const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.get('/api/hello',(req,res) => {
    res.send({message : "Hello Express"});
})

app.listen(port, ()=> {
    console.log(`service On ${port}`);
    }
    )