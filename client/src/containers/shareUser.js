import {Grid, Typography, Divider, Button, Dialog, DialogContent, DialogContentText, DialogActions, TextField, DialogTitle, Paper,LinearProgress, Modal, Table, TableHead, TableBody, TableRow, TableCell, IconButton} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';

import 'fontsource-roboto';
import ShareIcon from '@material-ui/icons/Share';
import StopIcon from '@material-ui/icons/Stop';


import Axios from 'axios';
import React from 'react'

class InShare extends React.Component {
    constructor(props){
        super(props)
        this.renderlist = this.renderlist.bind(this);
        this.shareCheck = this.shareCheck.bind(this);
        this.fileShareOn = this.fileShareOn.bind(this);
        this.fileShareOff = this.fileShareOff.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        this.state={
            userlist : '',
            search : '',
            file : this.props.file,
            loading : 0,
            menu : true,
            password : '',
            date : ''
        };
    }
    async datareturn(){
        let url = '/api/slist/'
        await this.setState({
            loading : 1
        })
        var loguser = window.sessionStorage.getItem('user')
        let data = await Axios.post(url,{filename:this.props.file,user:loguser})
        await this.setState({userlist:data.data})
        await this.setState({
            loading : 0
        })
        console.log(data);
        console.log(this.state.userlist);
    }

    async componentDidMount(){
        console.log("data 유저리스트 봤는데");
        // await this.datareturn()
    }
    //share On OFF
    //
    async fileShareOn(userno){
        var url = '/api/insertshare/'
        console.warn(userno);
        var loguser = window.sessionStorage.getItem('user');
        Axios.post(url,{user:userno,path:this.props.path,filename:this.props.file,shuser : loguser})
        await this.datareturn();

    }
    async fileShareOff(userno){
        var url = '/api/deleteshare/'
        var loguser = window.sessionStorage.getItem('user');
        Axios.post(url,{user:userno,filename:this.props.file})
        await this.datareturn();
    }

    
    async shouldComponentUpdate(nextProps,nextState){
        if(this.props.file != nextProps.file){
            await this.setState({
                file : nextProps.file
            })
            await this.datareturn();
            return true;
        }else if(nextProps.file == ""){
            return false;
        }
        if(this.state.menu != nextState.menu){
            return true
        }

    }

    renderlist(){
        let i =0
        let searchdata = new Array();
        if(this.state.userlist == '' || this.state.userlist=="nodata"){
            return(
                <div>no user</div>
            )
        }else{
            if(this.state.search != ''){
                searchdata = [];
                for(i=0 ; i< this.state.userlist.length; i++){
                    if(this.state.userlist[i].username.indexOf(this.state.search) == 0){
                        searchdata.push(this.state.userlist[i]);
                        console.log(i);
                        console.log(searchdata);
                        console.log(this.state.userlist[i].username.indexOf(this.state.search));
                        
                    }
                }
                console.log("searchdata");
                console.log(searchdata);
            }
            //
            if(this.state.search != ''){
                
            if(searchdata == null){
                    return(
                        <div>
                            No User
                        </div>
                    )
                }
            return searchdata.map((user)=>{
                    let i = 0;
                    return(
                    <TableRow>
                        <TableCell>
                            {user.username}
                        </TableCell>
                        <TableCell>
                            {this.shareCheck(user)}
                        </TableCell>
                    </TableRow>
                    )
                })
            }else{
                return this.state.userlist.map((user)=>{
                    return(
                    <TableRow>
                        <TableCell>
                            {user.username}
                        </TableCell>
                        <TableCell>
                            {this.shareCheck(user)}
                        </TableCell>
                    </TableRow>
                    )
                })
            }
            //
        }
    }
    shareCheck(user){
        console.warn(user);
        if(user.sharecheck == 1){
            return(
                <IconButton onClick={event => this.fileShareOff(user.uno)}>
                    <StopIcon></StopIcon>
                </IconButton>
            )
        }else{
            return(
                <IconButton onClick={event => this.fileShareOn(user.uno)}>
                    <ShareIcon></ShareIcon>
                </IconButton>
            )
        }


    }




    handleSearch(e){
        const valchange = {};
        valchange[e.target.name] = e.target.value;
        console.log("console.log(e.target.name);");
        console.log(e.target.name);
        if(e.target.name == null){
            if(this.state.menu == true){
                valchange['menu'] = false;
                console.log("이고됨?");
                console.log(this.state.menu);
            }else{
                valchange['menu'] = true;
                console.log("이고됨?");
                console.log(this.state.menu);
            }
        }
        this.setState(valchange);
    }

    render(){
        return(
            <Dialog open={this.props.open} onClose={event => this.props.close()} fullWidth={true} maxWidth={"md"}>
                    <Button color='default' variant='contained' name="menu" value={this.state.menu} onClick={event=>this.handleSearch(event)}>{this.state.menu ? `내부 유저 공유` :`외부 유저 공유`} </Button>
                    <DialogTitle id="form-dialog-title">공유 기능</DialogTitle>
                    {this.state.menu ? 
                            <DialogContent>
                                <DialogContentText>
                                    유저 검색 <TextField type="text" name="search" value={this.state.search} onChange={event => this.handleSearch(event)}></TextField>
                                </DialogContentText>
                                <Table stickyHeader size="small" style={{maxHeight:500,overflowX:"hidden",overflowY:"auto"}}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                유저이름
                                            </TableCell>
                                            <TableCell>
                                                공유
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.renderlist()}
                                    </TableBody>
                                </Table>
                            </DialogContent>
                            : 
                            <DialogContent>
                                <DialogContentText>
                                    공유링크 생성  <Button>생성 버튼</Button>
                                </DialogContentText>
                                <DialogContentText>
                                    비밀번호 생성 <TextField type="text" name="password" fullWidth={true} onChange={event => this.handleSearch(event)}></TextField><Button>비밀번호지정</Button>
                                </DialogContentText>
                                <DialogContentText>
                                    공유기한 설정 
                                    <input type="date" name="date" onChange={event => this.handleSearch(event)}></input>
                                </DialogContentText>
                                <Button>기한설정</Button>
                            </DialogContent>
                            }
                        <DialogActions>
                            <Button onClick={event =>this.props.close()} color="primary">
                                닫기
                            </Button>
                        </DialogActions>
                        
                        
            </Dialog>
        )
    }

}

export default (InShare);