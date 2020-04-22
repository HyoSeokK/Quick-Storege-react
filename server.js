const express = require('express');
const bodyparser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
app.use(bodyparser.urlencoded({extended :true}));
app.use(bodyparser.json());
const cus = [
    {
    "id" : 1,
    "name" : "강효석",
    "image" : "https://placeimg.com/64/64/1",
    "gender" : "남",
    "address" : "의정부"
    }, 
    {
      "id" : 2,
      "name" : "강효석",
      "image" : "https://placeimg.com/64/64/any",
      "gender" : "남",
      "address" : "의정부"
      }, 
      {
        "id" : 3,
        "name" : "강효석",
        "image" : "https://placeimg.com/64/64/any",
        "gender" : "남",
        "address" : "의정부"
        }, 
  ]

app.get('/api/hello',(req,res) => {
    res.send({message : "Hello Express"});
})

app.get('/api/customers',(req,res)=>{
    res.send(
        [
            {
            "id" : 1,
            "name" : "강효석",
            "image" : "https://placeimg.com/64/64/1",
            "gender" : "남",
            "address" : "의정부"
            }, 
            {
              "id" : 2,
              "name" : "강효석",
              "image" : "https://placeimg.com/64/64/any",
              "gender" : "남",
              "address" : "의정부"
              }, 
              {
                "id" : 3,
                "name" : "강효석",
                "image" : "https://placeimg.com/64/64/any",
                "gender" : "남",
                "address" : "의정부"
            },
        ] 
    )
})


app.listen(port, ()=> {
    console.log(`service On ${port}`);
    }
    )