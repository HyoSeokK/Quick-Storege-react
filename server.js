const sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }


const express = require('express');
const bodyparser = require('body-parser');
const app = express();
let connection;
//process.env.PORT
//환경 설정값중 PORT에 대한 내역이 있으면
//PORT값으로 설정 아니면 5000으로 포트 지정
const port = 5000 || process.env.PORT;

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

const fst = require('fs-extra');
//폴더 사이즈 구하기위한 툴
//
const getSize = require('get-folder-size');


const path = require('path');
const OS = require('os');
const { reset } = require('nodemon');

// DB 커넥션 부분 및 설치부분
//MariaDB와 MySql은 같이 사용이 가능하다는 것 기억하기
//커넥터가 mysql이지만 동일하게 사용이 가능
//database 설정값 가져오기
async function dbdataFW(req,res){
    await fs.writeFileSync('./database.json',`
        {
            "host" : "${req.body.host}",
            "user" : "${req.body.user}",
            "password" : "${req.body.password}",
            "port" : "${req.body.port}",
            "database" : "${req.body.database}"
        }
        ` ,(err)=>{
            if(err) throw err;
            console.log("성공적");
        })
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
            let sql1 = "CREATE TABLE userspace(u_no INT(10) NOT NULL AUTO_INCREMENT,username VARCHAR(50) NOT NULL ,pass VARCHAR(50) NOT NULL,repo VARCHAR(50) NOT NULL ,admin INT(10) NOT NULL DEFAULT '0', PRIMARY KEY (u_no));"
            let sql2 = "create table sharespace( " +
                        "u_no INT(10) NOT NULL,"+
                        "file_name LONGTEXT NOT NULL,"+
                        "file_path LONGTEXT NOT NULL,"+
                        "share_date TIMESTAMP default CURRENT_TIMESTAMP,"+
                        "share_user varchar(50),"+
                        "PRIMARY KEY (u_no),"+
                        "FOREIGN KEY (u_no) REFERENCES userspace (u_no)"+
                        ")";
            let sql3 = "CREATE TABLE extshare (" +
                "`no` BIGINT(50) NOT NULL AUTO_INCREMENT," +
                "`username` VARCHAR(50) NOT NULL COLLATE 'utf8_bin'," +
                "`filename` LONGTEXT NOT NULL COLLATE 'utf8_bin',"+
                "`filepath` LONGTEXT NOT NULL COLLATE 'utf8_bin',"+
                "`filelink` LONGTEXT NOT NULL COLLATE 'utf8_bin',"+
                "`password` VARCHAR(50) NULL DEFAULT NULL COLLATE 'utf8_bin',"+
                "`start_date` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,"+
               " `end_date` DATE NULL DEFAULT NULL,"+
                "PRIMARY KEY (`no`)"+
            ")COLLATE 'utf8_bin' ENGINE=InnoDB ROW_FORMAT=Dynamic AUTO_INCREMENT=53;";

            let sql4 =" CREATE TABLE `config` ("+
            "    `hostlink` MEDIUMTEXT NULL"+
           " )"+
            "COLLATE='utf8_general_ci';";

            let username = req.body.userID;
            let pass = req.body.userPass;
            let repo = req.body.userID +"/";
            let param = [username,pass,repo]
            await connection.query(sql1,(err, rows, fields)=>{
                console.log("1");
                if(err){
                    console.log(err);
                }
            })
            await connection.query(sql2,(err, rows, fields)=>{
                console.log("2");
                if(err){
                    console.log(err);
                }
            })
            await connection.query(sql3,(err, rows, fields)=>{
                console.log("3");
                if(err){
                    console.log(err);
                }
            })
            await connection.query(sql4,(err, rows, fields)=>{
                console.log("4");
                if(err){
                    console.log(err);
                }
            })
            sleep(50000)
            let config = `INSERT INTO config (hostlink) VALUES ('http://localhost:8080');`
            await connection.query(config,param,(err, rows, fields)=>{
                console.log("5");
            })
            let sql = 'INSERT INTO userspace (username,pass,repo,admin) VALUES (?,?,?,1);'
            await connection.query(sql,param,(err, rows, fields)=>{
                console.log("6");
                if(err){
                    console.log(err);
                }else{
                    fst.mkdirsSync('./upload/');
                    fst.mkdirsSync('./upload/'+username);
                    console.log("성공");
                    res.send("done")
                }
            })

}
            
            
            


    app.get('/api/check',(req,res)=>{
        if(!fs.existsSync('./database.json')){
            res.send("not");
        }else{
            
            const dbdata = fs.readFileSync('./database.json');
            const db = JSON.parse(dbdata);
            const mariadb = require('mysql');
            connection = mariadb.createConnection({
                host:db.host, 
                port:db.port,
                user:db.user,
                password:db.password,
                database:db.database
            });
            connection.connect();
            res.send("yes")
        }
        
    })

    app.post('/api/install',(req,res)=>{
        console.log("들어옴");
        // fs.writeFile('./database.json',`
        // {
        //     "host" : "${req.body.host}",
        //     "user" : "${req.body.user}",
        //     "password" : "${req.body.password}",
        //     "port" : "${req.body.port}",
        //     "database" : "${req.body.database}"
        // }
        // ` ,(err)=>{
        //     if(err) throw err;
        //     console.log("성공적");
        // })
            dbdataFW(req,res)
            
    })

    app.post('/api/reset',(req,res)=>{
        // process.exit(1)
    })

    app.post('/api/DBconn',(req,res)=>{
    
    const mariadb = require('mysql');
    const connection = mariadb.createConnection({
        host:req.body.host, 
        port:req.body.port,
        user:req.body.user,
        password:req.body.password,
        database:req.body.database
    });
    
    connection.connect(err => {
        if(err){
            console.log("실패");
            res.send("1")
        }else{
            console.log("성공");
            res.send("2")
        }
    });
    //
    })


    // app.listen(port, ()=> {
    //     console.log(`service On ${port}`)
    //     }
    //     )
//////////////////////////////////////////////////////////////////



    

// 폴더 삭제 모듈
var deleteFolderRecursive = function(path) {
    console.log("1");
    if (fs.existsSync(path)) {
        console.log("2");
      fs.readdirSync(path).forEach(function(file, index){
        var curPath = path + "/" + file;
        console.log("3");
        if (fs.lstatSync(curPath).isDirectory()) { // recurse
            console.log("4");
          deleteFolderRecursive(curPath);
          console.log("5");
        } else { // delete file
          fs.unlinkSync(curPath);
          console.log("6");
        }
      });
      fs.rmdirSync(path);
      console.log("7");
    }
  };


  var oldCPUTime = 0
  var oldCPUIdle = 0
    function getLoad(){
      var cpus = OS.cpus()
      var totalTime = -oldCPUTime
      var totalIdle = -oldCPUIdle
      for(var i = 0; i < cpus.length; i++) {
          var cpu = cpus[i]
          for(var type in cpu.times) {
              totalTime += cpu.times[type];
              if(type == "idle"){
                  totalIdle += cpu.times[type];
              }
          }
      }
  
      var CPUload = 100 - Math.round(totalIdle/totalTime*100)
      oldCPUTime = totalTime
      oldCPUIdle = totalIdle
  
      return {
          CPU:CPUload,
          mem:Math.round(OS.freemem()/OS.totalmem()*100)
      }       
  }
  // cpu데이터 사용량 전달
  app.get('/usagedata/',(req,res)=>{
    res.send(getLoad());
  })




// multer 라이브러리 파일의 업로드 다운로드에 대한 라이브러리
// 
// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination : (req,file,callback) =>{
//         callback(null,"upload");
//     },
//     //해당 아래의 설정을 하지 않으면 multer라이브러리가
//     //자동으로 암호화하여 데이터를 전달하게됨
//     filename:(req,file,callback)=>{
//         callback(null,file.originalname);
//         //file.originalname 을 통해 파일의 원형값을 받아 드릴수 있게함
//         //이것을 통해 파일명 암호화는 이부분을 건드리면된다는 것을 알수있음
//     }
// });
//해당 컨피그 값과 동기화 하는부분
// const upload = multer({storage:storage});
let multer = require('multer');


let upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, callback) => {
      let path = req.body.path;
      let filepath = './upload'+ path;
      fst.mkdirsSync(filepath);
      callback(null, filepath);
    },
    filename: (req, file, callback) => {
      //originalname is the uploaded file's name with extn
      callback(null, file.originalname);
    }
  })
});

// 이하 파일 관련 모듈
app.post('/upload/:filename', upload.single('file'), (req, res) => {
    console.log("접속완료");
    console.log(req.body);
    res.status(200).send();
});

//다운로드
//실제 저장 경로 위치에 있는 파일을 전송 시켜줌
// 브라우저에서는 기본 다운로드로 진행
app.post('/download/:filename',(req,res)=>{
    let file = `./upload${req.body.path}/${req.params.filename}`;
    console.log("전송 요청은 들어옴"+file);
    res.download(file);
})

// 파일 단일 삭제
app.post('/delete/:filename',(req,res)=>{
    let file = `./upload${req.body.path}/${req.params.filename}`;
    fs.unlinkSync(file)
    res.send('ok');
})

// 폴더삭제
// 폴더 안해있는 내부 모든 파일시스템 구조 싹다 삭제함
app.post('/rmfoder/:fordername',(req,res)=>{
    let forder = `./upload${req.body.path}/${req.params.fordername}/`;
    deleteFolderRecursive(forder);
    res.send('ok');
})



//폴더 생성
//현재 파일 위치에 대한 경로를 받고 폴더명을 받으면 해댱 경로 폴더생성
app.post('/createforder/',(req,res)=>{
    let filepath = './upload'+ req.body.path+"/" + req.body.fordername;
    fst.mkdirsSync(filepath);
    res.send('1');
})

///////////////////////////////////////////////////////////////////
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
                    file.size = stats.size;
                    file.extension = p.split('.')[p.split('.').length - 1];
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
        res.send({data:"ok",admin:rows[0].admin});
    }else{
        console.log("로그인 실패");
        res.send("n");
    }
    })
})
// /api/insertuser/ 역할 : 프론트엔드에서 접근시에 로그인 판별해줌
// req.body <= 실질적인 데이턱값을 가지고있는 부분
// req.body 안에 매핑해서 보낸 키값을 연결해서 호출하면 데이터 불러올수있음
// 
app.post('/api/insertuser',(req,res)=>{
    let sql = 'INSERT INTO userspace (username,pass,repo) VALUES (?,?,?);'
    let username = req.body.username;
    let pass = req.body.pass;
    let repo = username + "/";
    let param = [username,pass,repo];
    connection.query(sql,param,(err, rows, fields)=>{
        if(err){
            console.log(err);
            res.send("fail")
        }else{
            console.log("성공");
            fst.mkdirsSync('./upload/'+username);
            res.send("Succes")
        }
        
    })
})

// 유저 관리를 위해 유저 리스트를 받는부분 
app.get('/api/listuser/',(req,res)=>{
    res.setTimeout(12000,()=>{
        console.log('request has time out');
        res.send(408);
    })
        let listdata = new Array();
        console.log("여기 검색함");
        let sql = 'select * from userspace';
        connection.query(sql,(err,rows,fileds)=>{
            let i = 0;
            let count = rows.length;
            if(err){
                console.log(err);
                res.send(err);
            }
            rows.forEach(p => {
                var data = new Object()
                var fordersize = 0
                getSize('./upload/'+p.username,(err,size)=>{
                    if(size < 1024*1024){
                        fordersize = (size / 1024).toFixed(2) + "KB";
                    }else if(size < 1024*1024*1024){
                        fordersize = (size / 1024 / 1024).toFixed(2) + "MB";
                    }else if(size < 1024*1024*1024){
                        fordersize = (size / 1024 / 1024).toFixed(2) + "GB";
                    }
                    data.username = p.username
                    data.size = fordersize
                    if(p.admin == 0){
                        listdata.push(data);
                    }else{
                         count = count - 1;
                    }
                    if(i==count){
                        console.log(listdata);
                        res.send(listdata);
                     }
                     i= i+1;
                })
                
                // fs.stat('./upload/'+ p.username,(err,stats)=>{
                //     data.username = p.username;
                //     data.size = stats.size;
                //     if(p.admin == 0){
                //         listdata.push(data);
                //     }else{
                //         count = count - 1;
                //     }
                //     if(i==count){
                //         console.log(listdata);
                //         res.send(listdata);
                //     }
                //     i= i+1;
                // })
            })
            
        })
    
})

//내부유저 공유 파트
// 유저리스트 및 파일이 공유된 파일인지 확인
// Slist
app.post('/api/slist/',(req,res)=>{
    res.setTimeout(12000,()=>{
        console.log('request has time out');
        res.send(408);
    })
        let counts = 0;
        let rowsize = 0;
        let listdata = new Array();
        console.log("여기 검색함");
        let file = req.body.filename;
        let user = req.body.user;
        let sql = 'select * from userspace';
        let check = 'select userspace.u_no,userspace.username,file_name,share_user  from userspace left outer join sharespace on userspace.u_no=sharespace.u_no  where file_name=? and username=?'
        connection.query(sql,(err,rows,fileds)=>{
            rowsize = rows.length;
            if(err){
                console.log(err);
                res.send(err);
            }
            counts = 1
            console.log(counts + "카운트");
            rows.forEach(p => {
                console.log(counts + "카운트");
                let data = new Object()
                data.uno = p.u_no
                data.username = p.username
                if(user == data.username){
                    return
                }
                connection.query(check,[file,p.username],(err,rows,file)=>{
                    if(rows.length == 1){
                        data.sharecheck = 1
                    }else{
                        data.sharecheck = 0
                    }
                    listdata.push(data);
                    
                    console.log(listdata);
                    if(counts == rowsize - 1){
                        
                        res.send(listdata)
                    }
                    counts = counts + 1;
                })
            })
            
        })
        
})
//유저 공유 insert
app.post('/api/insertshare/',(req,res)=>{
    res.setTimeout(12000,()=>{
        console.log('request has time out');
        res.send(408);
    })
    var sql = "insert into sharespace(u_no,file_name,file_path,share_user) value(?,?,?,?)"
    var uno = req.body.user
    var path = req.body.path
    var filename = req.body.filename
    var shuser = req.body.shuser
    var param =[uno,filename,path,shuser]
    connection.query(sql,param,(err,rows,filed)=>{
        if(err){
            console.log(err);
        }
    })

})
//유저 공유 delete
app.post('/api/deleteshare/',(req,res)=>{
    res.setTimeout(12000,()=>{
        console.log('request has time out');
        res.send(408);
    })
    var sql = "DELETE FROM sharespace where u_no=? and file_name=?"
    var uno = req.body.user
    var filename = req.body.filename
    var param =[uno,filename]
    connection.query(sql,param,(err,rows,filed)=>{
        if(err){
            console.log(err);
        }
    })

})
//유저공유 리스트
async function shareUserList(req,res){
    let listdata = new Array();
    var sql = "select userspace.u_no,userspace.username,file_name,file_path,share_user  from userspace Inner JOIN sharespace on userspace.u_no = sharespace.u_no  where userspace.username=?"
    var username = req.body.user;
    console.log(username);

    if(username==null){

    }else{
        await connection.query(sql,username,(err,rows,filed)=>{
            console.log(rows.length);
            if(rows.length == 0){
                let data = new Object();
                data.check = "n"
                res.send(data)
            }else{
                 rows.forEach(p =>{
                    let data = new Object();
                    data.filename = p.file_name;
                    data.filepath = p.file_path;
                    data.uno = p.u_no;
                    data.shareuser = p.share_user;
                    data.check = "y"
                    listdata.push(data);
                })
                console.log(listdata);
                res.send(listdata);
            }
        })
    }
    
}

app.post('/api/sharefilelist',(req,res)=>{
    res.setTimeout(12000,()=>{
        console.log('request has time out');
        res.send(408);
    })
    shareUserList(req,res);
})

////////////////////////////////////////////////////////////
// 외부유저 공유기능 
// 기본 링크 생성
 app.post('/api/shlink',(req,res)=>{
    listexcute(req,res);
})
// 데이터 처리하는 부분
async function listexcute(req,res){
    var sql = 'insert into extshare(username,filename,filepath,filelink) value(?,?,?,?)'
    var username = req.body.username;
    var filename = req.body.filename;
    var filepath = req.body.filepath;
    var link;
    let check = 0;
    while(1){
        link = Math.floor(Math.random() * (10000 - 1)) + 1;
        await getRandomlink(link, async function (result) {
            console.log("결과는 하단");
            console.log(result);
            check = await result;
        })
        console.log("체크 바뀜?");
        console.log(check);
        if(check == 1){
            break;
        }else{
            await sleep(1000)
            continue;
        }
    }
    var param =[username,filename,filepath,link]
    connection.query(sql, param,(err)=>{
        if(err){
            console.log(err);
            res.send("nope")
        }else{
            res.send("ok")
        }
    })
}
 async function getRandomlink(link, check) { //min ~ max 사이의 임의의 정수 반환
    var sql = 'select * from extshare where filelink=?'
    console.log("db 시작부");
     connection.query(sql,link,async (err,rows,filed)=>{
        console.log("db 체킹부");
        if(rows.length != 0){
            console.log("db 반환부 0");
             check(0);
        }else{
            console.log("db 반환부 1");
             check(1);
        }
    })
}

// 여기까지가 링크 생성부
//링크 채킹부
app.post('/api/linkcheck',(req,res)=>{
    console.log("여기는 체킹부");
    let sql = `select * from extshare where username=? and filename=? and filepath=?`;
    var username =req.body.username
    var filename = req.body.filename
    var filepath = req.body.filepath
    var param = [username,filename,filepath]
    console.log(param);
    connection.query(sql,param,(err,rows,filed)=>{
        var data = new Object()
        if(rows.length != 0){
            console.log(rows[0].filename);
            data.check = true
            data.filename =  rows[0].filename
            data.filepath = rows[0].filepath
            data.filelink = rows[0].filelink
            if(rows[0].password == ''){
                data.pass = ''
            }else{
                data.pass = rows[0].password
            }
            if(rows[0].end_date == ''){
                data.date = ''
                console.log(data);
                res.send(data)
            }else{
                let date = new Date(rows[0].end_date);
                let month = date.getMonth() + 1
                let transdate = date.getFullYear() + '-' + month + '-' + date.getDate()
                data.date = transdate
                console.log(transdate);
                res.send(data)
            }
        }else{
            data.filelink = ''
            data.check = false
            res.send(data)
        }
        
    })
})



// update pass
app.post('/api/shpass/',(req,res)=>{
    console.log("들어옴");
    var sql = 'update extshare set password=? where username=? and filename=? and filepath=?'
    var password = req.body.password
    var username =req.body.username
    var filename = req.body.filename
    var filepath = req.body.filepath
    var param = [password,username,filename,filepath]
    console.log(param);
    connection.query(sql,param,(err)=>{
        if(err){
            console.log(err);
            res.send("0");
        }else{
            res.send("1")
        }
    })
})

// update enddate
app.post('/api/shdate',(req,res)=>{
    console.log("들어옴");
    var sql = 'update extshare set end_date=? where username=? and filename=? and filepath=?'
    var date = req.body.date
    var username =req.body.username
    var filename = req.body.filename
    var filepath = req.body.filepath
    var param = [date,username,filename,filepath]
    console.log(param);
    connection.query(sql,param,(err)=>{
        if(err){
            console.log(err);
            res.send("0");
        }else{
            res.send("1")
        }
    })
})

// delete extsharelink
app.post('/api/shdel',(req,res)=>{
    var sql = 'DELETE FROM extshare where username=? and filename=? and filepath=?'
    var username =req.body.username
    var filename = req.body.filename
    var filepath = req.body.filepath
    var param = [username,filename,filepath]
    connection.query(sql,param,(err)=>{
        if(err){
            console.log(err);
            res.send("no");
        }else{
            res.send("ok")
        }
    })
})

// download page get
app.get('/api/extview/:id',(req,res)=>{
    let sql = `select * from extshare where filelink=${req.params.id}`;
    connection.query(sql,(err,rows,filed)=>{
        if(rows.length == 0){
            var data = new Object()
            data.isnone = 1;
            console.log(data);
            res.send(data)
        }else{
            
            var data = new Object()
            
            data.filename =  rows[0].filename
            
            data.filepath = rows[0].filepath
            
            data.isnone = 0;
            if(rows[0].filename.split('.')[1] != null){
                
                data.extension = rows[0].filename.split('.')[rows[0].filename.split('.').length -1];
            }else{
                
                data.extension = 'no'
            }
            if(rows[0].password == null){
                console.log("비번 존재X");
                data.pass = ''
                res.send(data)
            }else{
                console.log("비번 존재");
                data.pass = rows[0].password
                res.send(data)
            }
            console.log(data);
        }
    })
})

app.put('/api/config',(req,res)=>{
    let link = req.body.hostlink;
    let sql =  'update config set hostlink=?'
    
    connection.query(sql,link,(err)=>{
        if(err){
            console.log(err);
        }
        res.send("ok")
    })
})

app.get('/api/getlink',(req,res)=>{
    console.log("inlink");
    let sql = 'select * from config';

    connection.query(sql,(err,rows)=>{
        if(rows.length == 0){
            console.log("errrrrrrrr");
        }
        var data = new Object()
        data.hostlink = rows[0].hostlink
        res.send(data)

    })
})






//////////////////////////////////////////////////////////////
app.delete('/api/delete/:username',(req,res)=>{
    let name = req.params.username;
    let sql =  `DELETE FROM userspace WHERE username='${name}'`
    console.log(sql);
    connection.query(sql,(err,fileds)=>{
        if(err) console.log(err);
    })
    deleteFolderRecursive('./upload/'+name)
    res.send(202);
})




// upload image를 호출하게되면 ./upload이하의 내용을 얻어갈수가있음
// app의 보안성 관련 내용
// 우리는 파일자체를 가져가야 되기떄문에 해당 내용은 나중에 서버에서
// 로고파일 가져갈때 사용하기
app.use('/data',express.static('./serverImage'));
app.use('/storege',express.static('./upload'))





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





