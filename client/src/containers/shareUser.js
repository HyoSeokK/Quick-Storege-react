import {Grid, Typography, Divider, Button, Dialog, DialogContent, DialogContentText, DialogActions, TextField, DialogTitle, Paper,LinearProgress, Modal, Table, TableHead, TableBody, TableRow, TableCell, IconButton, Fade, Grow} from '@material-ui/core';
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
        this.fileReturn = this.fileReturn.bind(this)
        this.extlinkinsert = this.extlinkinsert.bind(this);
        this.extlinkdelete = this.extlinkdelete.bind(this);
        // this.handleChange = this.handleChange.bind(this);
        this.handlSearch = this.handlSearch.bind(this);
        this.renderextlink = this.renderextlink.bind(this);
        this.renderuphandler = this.renderuphandler.bind(this);
        this.extdateupdate = this.extdateupdate.bind(this);
        this.extpassupdate = this.extpassupdate.bind(this);
        this.state={
            //공유자산
            file : this.props.file,

            //일반 공유
            userlist : '',
            search : '',
            
            loading : 0,
            menu : true,

            //외부 공유 관련
            password : '',
            date : '',
            check : false,
            link : '',
            hostlink : '',
            extload : false,
            uphandler : 0,
            mindate : ''

        };
    }
    async datareturn(){
        let innerurl = '/api/slist/'
        await this.setState({
            loading : 1
        })
        var loguser = window.sessionStorage.getItem('user')
        let data = await Axios.post(innerurl,{filename:this.props.file,user:loguser})
        let linkdata = await Axios.get('/api/getlink')
        await this.setState({
            userlist:data.data,
            loading : 0,
            hostlink : linkdata.data.hostlink
        })
        console.log(data);
        console.log(this.state.userlist);
    }
    async fileReturn(){
        let exturl = '/api/linkcheck'
        await this.setState({
            loading : 1
        })
        var loguser = window.sessionStorage.getItem('user')
        let extcheck = await Axios.post(exturl,{filepath:this.props.path,filename:this.props.file,username : loguser})
        console.log('extcheck.data.date');
        console.log(extcheck.data.date);
        await this.setState({
            loading : 0,
            check : extcheck.data.check,
            link : extcheck.data.filelink,
            password : extcheck.data.pass,
            date : extcheck.data.date
        })
        console.log("여기는 파일에대한 정보검사기능입니다");
        console.log(extcheck);
    }


    async componentDidMount(){
        let today = new Date();
        let year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate()
        this.setState({
            mindate : year + '-' + month + '-'+day
        })


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
                file : nextProps.file,
                uphandler : 0
            })
            await this.fileReturn()
            await this.datareturn();
            return true;
        }else if(nextProps.file == ""){
            return false;
        }
        if(this.state.menu != nextState.menu || this.state.check != nextState.check || this.state.extload != nextState.extload){
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
        
                    }
                }
             
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



    // 지금부터는 모든 데이터를 처리하는 state 처리 함수
    handleValue(e){
        const valchange = {};
        if(e == "menu"){
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
        if(e  == 'check'){
            console.log("체크 이거 들어옴?");
            valchange['check'] = !this.state.check;
        }
        if(e == 'extbtn'){
            console.log("체크 이거 들어옴?");
            valchange['extload'] = !this.state.extload;
        }
        if(e == 'link'){
            valchange['link'] = ''
        }
        if(e == 'uphandler'){
            valchange['uphandler'] = ''
        }
        this.setState(valchange);
        
    }
    handlSearch(e){
        const valchange = {};
        valchange[e.target.name] = e.target.value;
        this.setState(valchange);
    }
    async extlinkinsert(){
        this.handleValue("extbtn")
        let url = '/api/shlink'
        let loguser = window.sessionStorage.getItem('user');
        let data = await Axios.post(url,{filepath:this.props.path,filename:this.props.file,username : loguser})
        console.log("인서트 시작");
        console.log("data");
        console.log(data);
        
        if(data.data == 'ok'){
            this.fileReturn()
            this.handleValue("extbtn")
            this.handleValue("check")
        }
    }


    async extlinkdelete(){
        this.handleValue("extbtn")
        let url = '/api/shdel'
        let loguser = window.sessionStorage.getItem('user');
        let data = await Axios.post(url,{filepath:this.props.path,filename:this.props.file,username : loguser})
        console.log("data");
        console.log(data);
        if(data.data == 'ok'){
            this.handleValue("extbtn")
            this.handleValue('link')
            this.handleValue("check")
        }
    }
    async extpassupdate(){
        let url = '/api/shpass/'
        console.log("버튼클릭 확인");
        let loguser = window.sessionStorage.getItem('user');
        let data = await Axios.post(url,{password : this.state.password,filepath:this.props.path,filename:this.props.file,username : loguser})
        if(data.data==0){
            // 에러
            this.setState({
                uphandler : 2
            })

        }else{
            // 낫에러
            this.setState({
                uphandler : 1
            })

        }
    }
    async extdateupdate(){
        console.log("버튼클릭 확인");
        let url = '/api/shdate/'
        let loguser = window.sessionStorage.getItem('user');
        let data = await Axios.post(url,{date : this.state.date,filepath:this.props.path,filename:this.props.file,username : loguser})
        if(data.data==0){
            //에러
            this.setState({
                uphandler : 4
            })
        }else{
            //낫 에러
            this.setState({
                uphandler : 3
            })
        }
    }

    renderuphandler(){
        if(this.state.uphandler == 1){
            return(
                <Grow
                in={this.state.uphandler == 1}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.link == 1 ? { timeout: 1000 } : {})}
                >
                    <Alert severity="success">
                        <AlertTitle>패스워드 성공</AlertTitle>
                         정상 업로드 처리가 되었습니다
                    </Alert>
                </Grow>
            )
        }else if(this.state.uphandler == 2){
            return(
                <Grow
                in={this.state.uphandler == 2}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.uphandler == 2 ? { timeout: 1000 } : {})}
                >
                    <Alert severity="error">
                        <AlertTitle>패스워드 실패</AlertTitle>
                         정상적으로 처리되지 않았습니다
                    </Alert>
                </Grow>
            )
        }else if(this.state.uphandler == 3){
            return(
                <Grow
                in={this.state.uphandler == 3}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.uphandler == 3 ? { timeout: 1000 } : {})}
                >
                    <Alert severity="success">
                        <AlertTitle>기한설정 성공</AlertTitle>
                        정상 업로드 처리가 되었습니다
                    </Alert>
                </Grow>
            )
        }else if(this.state.uphandler == 4){
            return(
                <Grow
                in={this.state.uphandler == 4}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.uphandler == 4 ? { timeout: 1000 } : {})}
                >
                    <Alert severity="error">
                        <AlertTitle>기한설정 실패</AlertTitle>
                         정상적으로 처리되지 않았습니다
                    </Alert>
                </Grow>
            )
        }else{
            return(
                <Grow
                in={this.state.uphandler == 0}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.uphandler == 0 ? { timeout: 1000 } : {})}
                >
                    <div></div>
                </Grow>
            )
        }
    }

    renderextlink(){
        if(this.state.link != ''){
            return(
                <Grow
                in={this.state.link != ''}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.link != '' ? { timeout: 1000 } : {})}
                >
                    <Alert severity="success">
                        <AlertTitle>공유 시작</AlertTitle>
                        림크 : {this.state.hostlink}/Linkview/{this.state.link}
                    </Alert>
                </Grow>
            )
        }else{
            return(
                <Grow
                in={this.state.link == ''}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.link == '' ? { timeout: 1000 } : {})}
                >
                    <Alert severity="error">
                        <AlertTitle>공유 없음</AlertTitle>
                    </Alert>
                    
                </Grow>

            )
        }
    }

    render(){
        return(
            <Dialog open={this.props.open} onClose={event => this.props.close()} fullWidth={true} maxWidth={"md"}>
                    <Button color='default' variant='contained' name="menu" value={this.state.menu} onClick={event=>this.handleValue("menu")}>{this.state.menu ? `내부 유저 공유` :`외부 유저 공유`} </Button>
                    <DialogTitle id="form-dialog-title">공유 기능</DialogTitle>
                    {this.state.menu ? 
                            <DialogContent>
                                <DialogContentText>
                                    유저 검색 <TextField type="text" name="search" value={this.state.search} onChange={event => this.handlSearch(event)}></TextField>
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
                                    공유링크 생성   { this.state.check ? <Button onClick={e=>this.extlinkdelete()} disabled={this.state.extload}>공유 정지</Button> : <Button onClick={e => this.extlinkinsert()} disabled={this.state.extload}>공유 시작</Button>}
                                </DialogContentText>
                                {this.renderextlink()}
                                <DialogContentText>
                                    비밀번호 생성 <TextField type="text" name="password" fullWidth={true} onChange={event => this.handlSearch(event)} value={this.state.password}></TextField>
                                    <Button disabled={!this.state.check} onClick={this.extpassupdate}>비밀번호지정</Button>
                                </DialogContentText>
                                <DialogContentText>
                                    공유기한 설정 
                                    <input type="date" name="date" min={this.state.mindate} onChange={event => this.handlSearch(event)} value={this.state.date}></input>
                                </DialogContentText>
                                <Button disabled={!this.state.check} onClick={this.extdateupdate}>기한설정</Button>
                                {this.renderuphandler()}
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