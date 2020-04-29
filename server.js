
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

const port = process.env.PORT || 5000;
app.use(bodyparser.urlencoded({extended :true}));
app.use(bodyparser.json());
const fs = require('fs');
const dbdata = fs.readFileSync('./database.json');
const db = JSON.parse(dbdata);
const mariadb = require('mysql');
const connection = mariadb.createConnection({
    host:db.host, 
    port:db.port,
    user:db.user,
    password:db.password,
    database:db.database
});

connection.connect();

const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req,file,callback) =>{
        callback(null,"upload");
    },
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
    }
});


const upload = multer({storage:storage});


app.get('/api/hello',(req,res) => {
       connection.query('select * from customer',(err, rows, fields)=>{
           res.send(rows);
       })
})

app.get('/api/customers',(req,res)=>{
    connection.query('select * from customer',(err, rows, fields)=>{
        res.send(rows);
    })
})

app.post('/api/login',(req,res)=>{
    console.log(req.body.pass);
    let sql = 'select * from userspace where username=? and pass=?'
    let username = req.body.username;
    let pass = req.body.pass;
    let param = [username,pass]
    console.log(param);
    connection.query(sql,param,(err, rows, fields)=>{
        if(rows.length != 0){
        res.send("ok");
    }else{
        res.send("n");
    }
    })
})





app.use('/image',express.static('./upload'));







app.post('/api/customers', upload.single('image'),(req,res)=>{
    let sql = 'INSERT INTO customer (name,gender,address,image) VALUES (?,?,?,?);';
    let image = '/image/' + req.file.filename;
    let name = req.body.name;
    let gender = req.body.gender;
    let address = req.body.address;
    let params = [name,gender,address,image];
    connection.query(sql,params,(err,rows,fileds)=>{
        res.send(rows);
    })
});


app.listen(port, ()=> {
    console.log(`service On ${port}`);
    }
    )