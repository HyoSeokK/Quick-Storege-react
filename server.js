
const express = require('express');
const bodyparser = require('body-parser');
const app = express();

//process.env.PORT
//환경 설정값중 PORT에 대한 내역이 있으면
//PORT값으로 설정 아니면 5000으로 포트 지정
const port = process.env.PORT || 5000;

app.use(bodyparser.urlencoded({extended :true}));
app.use(bodyparser.json());

//fs라이브러리
//파일과 관련된 전부
//사용내역
// fs.readdir 폴더내에 있는 파일 + 폴더 배열값으로 리턴함
// fs.stat 파일의 정보값을 가지고옴 (폴더인지 파일인지 구별가능/파일 생성일자등 확인가능)
// ps.) 추후에 데이터 에디터용으로 만들수 있음
// ps.) write를 통해 텍스트 데이터 받아와 처리 하기
const fs = require('fs');


//database 설정값 가져오기
const dbdata = fs.readFileSync('./database.json');



const db = JSON.parse(dbdata);
const mariadb = require('mysql');
const path = require('path');

// DB 커넥션 부분
//MariaDB와 MySql은 같이 사용이 가능하다는 것 기억하기
//커넥터가 mysql이지만 동일하게 사용이 가능
const connection = mariadb.createConnection({
    host:db.host, 
    port:db.port,
    user:db.user,
    password:db.password,
    database:db.database
});
connection.connect();
//



// multer 라이브러리 파일의 업로드 다운로드에 대한 라이브러리
// 
const multer = require('multer');
const storage = multer.diskStorage({
    destination : (req,file,callback) =>{
        callback(null,"upload");
    },
    //해당 아래의 설정을 하지 않으면 multer라이브러리가
    //자동으로 암호화하여 데이터를 전달하게됨
    filename:(req,file,callback)=>{
        callback(null,file.originalname);
        //file.originalname 을 통해 파일의 원형값을 받아 드릴수 있게함
        //이것을 통해 파일명 암호화는 이부분을 건드리면된다는 것을 알수있음
    }
});
//해당 컨피그 값과 동기화 하는부분
const upload = multer({storage:storage});
///////////////////////////////////////////////////////////////////

app.get('/api/test/',(req,res)=>{
    const linst = './upload/이거도 폴더임'
    fs.readdir(linst,(err,data)=>{
        if(err){
            console.log("no file here");
            res.send([{"data": "nodata"}])
        }else{
        data.forEach(p =>{
            fs.stat(path+p,(err,stats)=>{
                var file = new Object()
                if(err){
                    console.log(err);
                }else{
                    file.id =  id
                    file.name =  p
                    /////////////////////////////////////////////////
                    // stats.birthtime 
                    // 값이 gpt 태평양 시간 값까지 나오기 떄문에 값정리를 위해
                    // 분리하여 전달함
                    var date = String(stats.birthtime)
                    var datearr = date.split(" ",5)
                    // file.date =  datearr
                    datearr.forEach((e)=>{
                        // filedate의 여부를 통한 날짜 데이터 좀더 깔끔하게
                        // 데이터전달 삼항연산자 사용
                        file.date ? file.date = file.date + e + " " : file.date = e + " "
                    })
                    /////////////////////////////////////////////////
                    file.isFile = stats.isFile()
                    list.push(file)
                }
                 if(id == data.length - 1){
                     list.sort(function(a,b){
                         var o1 = a['isFile'];
                         var o2 = b['isFile'];
                         var p1 = a['id'];
                         var p2 = b['id'];
                         if(o1 < o2) return -1;
                         if(o1 > o2) return 1;
                        if (p1 < p2) return -1;
                        if (p1 > p2) return 1;
                        return 0;
                     })
                     console.log("전송선공");
                     res.send(list)
                 }
                id = id + 1
            })
        })}
    })
})




// 역할 : /api/list/ 링크로 접근을 할시에 현재 디렉토리에 있는 파일목록을 줌
//       또한 isFile이라는 태그를 통해 폴더 구별 가능
// 사용법 : path의 경로를 바꿔주면 목록을 자연스럽게 불러오는데 이때 중요한것       
//        대상의 폴더를 지정하기 위해 현재디렉토리 위치의 교환을 위해
//        sessionID(root폴더)에서부터 교환이 시작됨 폴더를 클릭하면 자연스럽게
//        다음폴더를 넘어 갈수있게 req 값에 ID/dir/dir 이런식으로 전달하기
app.post('/api/list/',(req,res)=>{
    let list = new Array();
    let linkpath = req.body.path;
    console.log(linkpath);
    var path = './upload'+linkpath+'/';
    console.log(path);
    var id = 0;
    fs.readdir(path,(err,data)=>{
        console.log(data.length);
        if(data.length==0){
            console.log("no file here");
            res.send({data:"nodata"})
        }else{
        data.forEach(p =>{
            fs.stat(path+p,(err,stats)=>{
                var file = new Object()
                if(err){
                    console.log(err);
                }else{
                    file.id =  id
                    file.name =  p
                    /////////////////////////////////////////////////
                    // stats.birthtime 
                    // 값이 gpt 태평양 시간 값까지 나오기 떄문에 값정리를 위해
                    // 분리하여 전달함
                    var date = String(stats.birthtime)
                    var datearr = date.split(" ",5)
                    // file.date =  datearr
                    datearr.forEach((e)=>{
                        // filedate의 여부를 통한 날짜 데이터 좀더 깔끔하게
                        // 데이터전달 삼항연산자 사용
                        file.date ? file.date = file.date + e + " " : file.date = e + " "
                    })
                    /////////////////////////////////////////////////
                    file.isFile = stats.isFile()
                    list.push(file)
                }
                 if(id == data.length - 1){
                     list.sort(function(a,b){
                         var o1 = a['isFile'];
                         var o2 = b['isFile'];
                         var p1 = a['id'];
                         var p2 = b['id'];
                         if(o1 < o2) return -1;
                         if(o1 > o2) return 1;
                        if (p1 < p2) return -1;
                        if (p1 > p2) return 1;
                        return 0;
                     })
                     console.log("전송선공");
                     res.send(list)
                 }
                id = id + 1
            })
        })}
    })
})

// /api/login/ 역할 : 프론트엔드에서 접근시에 로그인 판별해줌
// req.body <= 실질적인 데이턱값을 가지고있는 부분
// req.body 안에 매핑해서 보낸 키값을 연결해서 호출하면 데이터 불러올수있음
// 
app.post('/api/login',(req,res)=>{
    let sql = 'select * from userspace where username=? and pass=?'
    let username = req.body.username;
    let pass = req.body.pass;
    let param = [username,pass]
    connection.query(sql,param,(err, rows, fields)=>{
    if(rows.length != 0){
        console.log(username + "로그인 성공");
        res.send("ok");
    }else{
        console.log("로그인 실패");
        res.send("n");
    }
    })
})




// upload image를 호출하게되면 ./upload이하의 내용을 얻어갈수가있음
// app의 보안성 관련 내용
// 우리는 파일자체를 가져가야 되기떄문에 해당 내용은 나중에 서버에서
// 로고파일 가져갈때 사용하기
app.use('/image',express.static('./upload'));





// 실습하기전 연습용 데이터
/////////////////////////////////////////////////////////
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