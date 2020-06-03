import React, {Component} from 'react';
import {Grid, Typography, Divider, Button, Dialog, DialogContent, DialogContentText, DialogActions, TextField, DialogTitle, Paper,LinearProgress, Modal, Table, TableHead, TableBody, TableRow, TableCell} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import 'fontsource-roboto';
import Axios from 'axios';

import GetAppIcon from '@material-ui/icons/GetApp';
import ImageIcon from '@material-ui/icons/Image';


export default class Adminpage extends Component{

    constructor(props){
        super(props);
        
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.insertUser = this.insertUser.bind(this);
        this.checkdata = this.checkdata.bind(this);
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalOpen = this.handleModalOpen.bind(this);
        this.handleManageOpen = this.handleManageOpen.bind(this);
        this.handleManageClose = this.handleManageClose.bind(this);
        this.state ={
            open : false,
            userid : '',
            userpass : '',
            check : '',
            openModal : false,
            manage : false
        };
    }
    handleManageOpen(){
        this.setState({
            manage : true
        })
    }
    handleManageClose(){
        this.setState({
            manage : false
        })
    }


    handleModalClose(){
        this.setState({
            openModal : false
        })
    }
    handleModalOpen(){
        this.setState({
            openModal : true
        })
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

    async insertUser(){
        const url = '/api/insertuser';
        await Axios.post(url,{username : this.state.userid,pass:this.state.userpass}).then((response)=>{
            this.setState({
                check : response.data
            })
        })
        this.setState({
            userid : "",
            userpass : "",
            openModal : true
        })
        this.handleClose();
    }
    checkdata(){
        const user = this.state.userid
        const data = this.state.check
        if(data=="Succes"){
            return(
                <Modal
                    open={this.state.openModal}
                    onClose={this.handleModalClose}>
                    <Alert severity="success">
                        <AlertTitle>Success</AlertTitle>
                        정상적으로 유저를 생성했습니다! <strong>{user}</strong>
                    </Alert>
                </Modal>
            )
        }else if(data == "fail"){
            return(
                <Modal
                    open={this.state.openModal}
                    onClose={this.handleModalClose}>
                    <Alert severity="error">
                        <AlertTitle>실패</AlertTitle>
                        동일명을 가진 유저가 존재합니다 <strong>check it out!</strong>
                    </Alert>
                </Modal>
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
                    <Button color='default' variant='contained' onClick={event => this.handleManageOpen()}>유저 관리</Button>
                    <UserTable open={this.state.manage} close={this.handleManageClose}/>
                    {this.checkdata()}
                </Paper>
                <Dialog open={this.state.open} onClose={event =>this.handleClose} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">유저생성</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    유저를 생성하기위한 정보를 입력하세요!
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
                <Paper style={{padding:"20px" ,margin:"20px"}}>
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
class UserTable extends React.Component{
    constructor(props){
        super(props);
        this.renderlist = this.renderlist.bind(this);
        this.deleteaction = this.deleteaction.bind(this);
        this.state={
            userlist : null
        };
    }

    async datareturn(){
        let url = '/api/listuser'
        return Axios.post(url,{username:""})
    }

    async componentDidMount(){
        console.log("data 유저리스트 봤는데");
        const data = await this.datareturn();
        console.log(data.data);
        this.setState({userlist:data.data})
    }

    async deleteaction(name){
        let url = '/api/delete/'
        Axios.delete(url,{username : name});
        const data = await this.datareturn();
        this.setState({userlist:data.data})
    }
    renderlist(){
        if(!this.state.userlist){
            return(
                <div></div>
            )
        }else{
            return this.state.userlist.map((user)=>{
                return(
                <TableRow>
                    <TableCell>
                        {user.username}
                    </TableCell>
                    <TableCell>
                        {user.size}
                    </TableCell>
                    <TableCell>
                         <IconButton aria-label="Delete" onClick={()=>this.deleteaction(user.username)}>
                                 <DeleteIcon></DeleteIcon>
                         </IconButton>
                    </TableCell>
                </TableRow>
                )
            })
        }
        
    }

    render(){
        return(
            <Dialog open={this.props.open} onClose={event =>this.props.close()} aria-labelledby="form-dialog-title" fullWidth={true} maxWidth = {'md'}>
                        <DialogTitle id="form-dialog-title">유저관리</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    유저 관리 페이징입니다.
                                </DialogContentText>
                                <Table stickyHeader size="small" style={{maxHeight:500,overflowX:"hidden",overflowY:"auto"}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                유저이름
                                            </TableCell>
                                            <TableCell>
                                                사용량
                                            </TableCell>
                                            <TableCell>
                                                부가설정
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderlist()}
                                    </TableBody>
                                </Table>
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={event =>this.props.close()} color="primary">
                                닫기
                            </Button>
                        </DialogActions>
            </Dialog>
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