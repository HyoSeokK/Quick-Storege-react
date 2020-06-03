import React, {Component} from 'react';
import {Grid, Typography, Divider, Button, Dialog, DialogContent, DialogContentText, DialogActions, TextField, DialogTitle, Paper,LinearProgress} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import 'fontsource-roboto';
import Axios from 'axios';



export default class Adminpage extends Component{

    constructor(props){
        super(props);
        
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.insertUser = this.insertUser.bind(this);
        this.checkdata = this.checkdata.bind(this);
        this.state ={
            open : false,
            userid : '',
            userpass : '',
            check : '',
        };
    }

    
    handleClickOpen = () =>{
        this.setState({
            open : true
        })
    };
    handleClose = () =>{
        this.setState({
            open : false
        })
    };
    // 이름 : handleValue
    // 역할 : 텍스트 필드의 데이터값을 컨트롤 하는 역할
    handleValue(e){
        const valchange = {};
        valchange[e.target.name] = e.target.value;
        this.setState(valchange);
    }

    insertUser(){
        const url = '/api/insertuser';
        Axios.post(url,{username : this.state.userid,pass:this.state.userpass}).then((response)=>{
            this.setState({
                check : response.data
            })
        })
        this.setState({
            userid : "",
            userpass : ""
        })
        this.handleClose();
    }
    checkdata(){
        const user = this.state.userid
        const data = this.state.check
        if(data=="Succes"){
            return(
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    정상적으로 유저를 생성했습니다! <strong>{user}</strong>
                </Alert>
            )
        }else if(data == "fail"){
            return(
                <Alert severity="error">
                    <AlertTitle>실패</AlertTitle>
                    동일명을 가진 유저가 존재합니다 <strong>check it out!</strong>
                </Alert>
            )
        }else{
            return(
                <div></div>
            )
        }
    }

    render(){
        return(
            <Grid item xs={10}>
                <Typography variant="h3" component="h2" style={{marginTop:"40px"}}>
                     <b>관리자 페이지</b>
                </Typography>
                <Divider variant="fullWidth" style={{marginTop:"30px",marginBottom:"30px"}}></Divider>
                <Paper style={{padding:"20px"}}>
                    <Typography variant="h4" component="h2">
                        <b>유저관리</b>
                    </Typography>
                    <Divider variant='middle' style={{marginTop:"20px",marginBottom:"10px"}}></Divider>
                    <Typography variant="subtitle1" component="h2">
                        하단의 버튼을 누르고 유저의 아이디 비밀번호를 입력하면 해당하는 유저의 저장장소와함께 아이디가 생성됩니다.
                    </Typography>
                    <Button color='default' variant='contained' onClick={event => this.handleClickOpen()}>유저 생성</Button>
                    {this.checkdata()}
                </Paper>
                <Dialog open={this.state.open} onClose={event =>this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">유저생성</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    생성할 폴더의 이름을 입력 해주세요
                                </DialogContentText>
                                <TextField type="text" label="UserName" name="userid" value={this.state.userid} onChange={this.handleValue} /><br/>
                                <TextField type='password' label="Userpass" name="userpass" value={this.state.userpass} onChange={this.handleValue} />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={event => this.handleClose()} color="primary">
                                취소
                            </Button>
                            <Button onClick={event => this.insertUser()} color="primary">
                                생성
                            </Button>
                            </DialogActions>
                </Dialog>


                <Divider variant="fullWidth" style={{marginTop:"30px",marginBottom:"30px"}}></Divider>
                <Paper style={{padding:"20px"}}>
                    <Typography variant="h4" component="h2">
                        <b>시스템 자원</b>
                    </Typography>
                    <Divider variant='middle' style={{marginTop:"20px",marginBottom:"10px"}}></Divider>
                    <Typography variant="subtitle1" component="h2">
                        시스템 자원사용량 표시
                    </Typography>
                    <CPUMemUsage />

                </Paper>
            </Grid>
        )
    }
}

class CPUMemUsage extends React.Component{
    constructor(props){
        super(props)
        this.usageCheck = this.usageCheck.bind(this);
        this.state = {
            intervalId : '',
            cpuload : '',
            memload : '',
            start : 0
        }
    }
    componentDidMount(){
        var intervalId = setInterval(this.usageCheck, 1000);
        this.setState({intervalId : intervalId})
        Axios.get('/usagedata/').then(
            response =>{
                this.setState({
                    cpuload:response.data.CPU,
                    memload:response.data.mem
                });
            })
    }

    componentWillUnmount(){
        clearInterval(this.state.intervalId);
        this.setState({start : 0})
        console.log( "언마운팅 되버림 ㅜㅜ");
    }
    usageCheck(){
        Axios.get('/usagedata/').then(
            response =>{
                this.setState({
                    cpuload:response.data.CPU,
                    memload:response.data.mem
                });
            })

    }
    render(){
        return(
            <div>
                <Typography variant="subtitle1" component="h2">
                            <b>CPU 자원</b> 
                            <LinearProgress variant="determinate" value={this.state.cpuload}/><b>{this.state.cpuload}%</b> 
                </Typography>

                <Typography variant="subtitle1" component="h2">
                            <b>메모리 사용량</b>
                            <LinearProgress variant="determinate" value={this.state.memload}/><b>{this.state.memload}%</b> 
                </Typography>
            </div>
        )
    }
}