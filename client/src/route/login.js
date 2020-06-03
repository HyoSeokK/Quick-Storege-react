import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { withStyles,Paper,CircularProgress,Button,Container, Grid } from '@material-ui/core';
import Axios from 'axios';
import './css/login.css';
import Route, { Redirect } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import * as fileListAction from '../reducers/fileList'
import * as pathAction from '../reducers/pathSet'

const styles = theme =>({
    progress: {
      margin: theme.spacing.unit * 2
    },
    btn : {
        marginTop: 20
    },
    box :{
        alignItems: 'center',
        justifyContent:'center'
    }
  })
// class : Login
// 로그인을 진행하는 Routing 지점 컴포넌트 및 기능 포함
class Login extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            userid : "",
            pass : "",
            check : 0,
            servermgs : "",
            comple : 0,
            logck : this.props.logcheck,
            loginuser : this.props.loginuser
        }
        this.handleValue = this.handleValue.bind(this);
        this.submitHandle = this.submitHandle.bind(this);
        this.checkLogin = this.checkLogin.bind(this);
        // this.getFFileList = this.getFFileList.bind(this);
    }



    componentDidMount(){
        this.setState(
            {
                logck : 1
            }
        )
    }



    
    // componentWillMount(){
    //       this.timer = setInterval(this.progress,20);
    //      console.log(this.state.customer);
    // }

    // 이름 : Progress
    // 역할 : 로그인 버튼 누름과 동시에 서버와 통신중 대기 상황일때 로딩바
    progress = () =>{
    const {comple} = this.state
    this.setState({comple:comple>=100 ? 0 : comple + 1});
    }

    //이름 : handleValue
    //역할 : Input박스의 데이터 변화를 감지하고 
    //      Name을 통해 해당 state를 찾아 데이터를 넣어줌
    handleValue(e){
        const valchange = {};
        valchange[e.target.name] = e.target.value;
        this.setState(valchange);
    }


    // 이름 : submitHandle
    // 역할 : 로그인 버튼을 누르면 submit을 보내게되는데
    // 이때 일반적인 submit처리가 아닌 나만의 로그인 처리를 가능하도록
    // 설정하였음
    //2020 05 05 변경사항) 초기 path == 유저아이디 저장을 위한 리덕스 엑션을 추가함
    submitHandle(e){
        e.preventDefault();
        this.checkLogin().then((response) =>{
            if(response.data.data == "ok"){
                console.log("재접근 확인중");
                this.setState({servermgs : "로그인을 정상적으로 하셨습니다"});
                this.setState({logck : 0});
                window.sessionStorage.setItem('user', this.state.userid);
                window.sessionStorage.setItem('admin', response.data.admin);
                // this.getFFileList(window.sessionStorage.getItem('user'));
                const user = window.sessionStorage.getItem('user');
                this.props.PathAction.setPath(user);
                this.props.changeUser();
            }else{
                this.setState({servermgs : "아이디 비밀번호 재확인을 부탁드립니다"});
                this.setState({logck : 1})
            }
            this.setState({check:0});
        });
    }

    // async getFFileList(path){
    //     try{
    //         console.log("접근성공");
    //         await this.props.FileListAction.getFileList(path);
    //     }catch(e){
    //         console.log("에러발생");
    //         throw(e)
    //     }
    // }


    //이름 : checkLogin
    //역할 : 서버에 reestful 통신을 통해 내가 보낸 로그인 정보를 DB분석후
    //     로그인 성공인지 아닌지에대한 체크 데이터를 보내줌
    checkLogin(){
        console.log(this.state.userid);
        console.log(window.sessionStorage.getItem('user'));
        this.setState({check:1});
        const url = '/api/login';
        const formData = new FormData();
        return Axios.post(url,{ username:this.state.userid, pass:this.state.pass});
    }

    render(){
        const { classes } = this.props;
        return(
            <div className="loginmain">
                <Grid className={classes.root} alignItems="center" direction="column" container spacing={3}>
                    <Grid item>
                    <Paper  style={{width:400, height:500, background:"#D8D8D8"}}>
                        <Container className={classes.box}>
                            <form className="logform" onSubmit={this.submitHandle} style={{alignItems:'center', justify:'center'}}>
                            <h1>로그인</h1>
                            <TextField id="outlined-basic" label="UserName" varient="outlined" name="userid" onChange={this.handleValue}></TextField><br/>
                            <TextField type="password" id="outlined-basic" label="PassWord" varient="outlined" name="pass" value={this.state.pass} onChange={this.handleValue}></TextField><br/>
                                {this.state.check ?   <CircularProgress  variant="determinate" value={this.state.comple}></CircularProgress> :
                                    <Button  className={classes.btn} type="submit" color="primary" variant="contained">로그인</Button>
                                }
                            </form>
                            {this.state.logck ?  this.state.servermgs : "" }
                            {/* <Redirect to="/dashboard"/> */}
                        </Container>
                    </Paper>
                    </Grid>
                </Grid>
            </div>
        );
    }
} 

// function mapDispathToProps(dispatch){
//     return bindActionCreators(fileListAction,dispatch);
//   }

export default compose(withStyles(styles),connect((state)=>({
    path : state.PathSet.path
}),(dispatch)=>({
    FileListAction : bindActionCreators(fileListAction,dispatch),
    PathAction : bindActionCreators(pathAction,dispatch)
})))(Login);