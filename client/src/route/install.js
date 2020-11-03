import React from 'react';
import { Paper, withStyles, TextField, Box, Button, Grow } from '@material-ui/core';
import { Autocomplete, Alert } from '@material-ui/lab';
import Axios from 'axios'



const styles = theme => ({
    mainWindow: {
        width : "30em",
        margin : "0 auto",
    },
    HeadLine : {
        textAlign : "center",
    },
    box1: {
        display : "block",
        padding : "10px",
        margin : "20px"
    },
    box2:{
        padding : "10px",
        margin : "20px"
    },
    textLine : { 
        display : "block",
        marginTop : "0.5em",
    },
    btnDB : {
        width : "20em",
        margin : "0.5em auto"
    },
    confirmd : {
        width : "20em",
        margin : "0.5em "
        
    },
    box3 : {
        textAlign : "center"
    }
})


class Installpage extends React.Component{

    constructor(props){
        super(props)
        this.state={
            admUserID : '',
            admUserPass : '',
            admUserck : '',
            DBAdd : '127.0.0.1',
            DBid : '',
            DBPass : '',
            DBPort : '3306',
            DBon : '0',
            DBname : '',
            installck : true,
            checked : false,
            setChecked : false,
            check : 'no',
            passcheck : '0'
        }
        this.handleValue = this.handleValue.bind(this)
        this.dbCheck = this.dbCheck.bind(this)
        this.dbcheckText = this.dbcheckText.bind(this)
        this.setCloud = this.setCloud.bind(this)
        this.serverisOn = this.serverisOn.bind(this)
        this.checkText = this.checkText.bind(this)
    }
    async dbCheck(){
        console.log("체킹 스타트");
        const url = '/api/DBconn'
        await Axios.post(url,{host : this.state.DBAdd, user : this.state.DBid , password:this.state.DBPass, port:this.state.DBPort , database:this.state.DBname}).then((response)=>{
            console.log(response.data);
            this.setState({ DBon : response.data})
        })
        if(this.state.DBon == 2){
            this.setState({
                installck : false,
            })
        }else{
            this.setState({
                installck : true,
            })
        }

        console.log("check");
    }

    dbcheckText(){
        if(this.state.DBon == "2"){
            return(
                <Grow
                in={this.state.DBon == "2"}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.DBon == "2" ? { timeout: 1000 } : {})}
                >
                    <Alert severity="success">DB에 정상적으로 연결 되었습니다</Alert>
                </Grow>
            )

        }
        else if(this.state.DBon == "1"){
            return(
                <Grow
                in={this.state.DBon == "1"}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.DBon == "1" ? { timeout: 1000 } : {})}
                >
                    <Alert severity="error">입력 데이터를 확인해 주십시오!!!</Alert>
                </Grow>
            )
        }else{

        }
    }
    checkText(){
        if(this.state.passcheck == "1"){
            return(
                <Grow
                in={this.state.passcheck == "1"}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.passcheck == "1" ? { timeout: 1000 } : {})}
                >
                    <Alert severity="error">빈공간데이터가 존재합니다 채워주시길 바랍니다</Alert>
                </Grow>
            )
        }else if(this.state.passcheck == "2"){
            return(
                <Grow
                in={this.state.passcheck == "2"}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.passcheck == "2" ? { timeout: 1000 } : {})}
                >
                    <Alert severity="error">비밀번호가 일치하지 않습니다</Alert>
                </Grow>
            )

        }
        
    }


    
    async serverisOn(){
        await Axios.get('/api/check').then((response)=>{
            this.setState({
                check : response.data
            })
        }).catch((err)=>{
        })
        if(this.state.check=='yes'){
            this.props.settingOn()
        }
    }
    
    async setCloud(){
        if(this.state.admUserPass && this.state.admUserck && this.state.admUserck){
            if(this.state.admUserPass == this.state.admUserck){
            const url = '/api/install'
            this.setState({
                installck:true
            })
            await Axios.post(url,{userID:this.state.admUserID,userPass:this.state.admUserPass,host : this.state.DBAdd, user : this.state.DBid , password:this.state.DBPass, port:this.state.DBPort, database:this.state.DBname}).then((response)=>{
                console.log(response.data);
                this.setState({ DBon : response.data})
            }).catch((err)=>{
            })
            setInterval(this.serverisOn(),50000);
            }else{
                this.setState({
                    passcheck : "2"
                });
            }
        }else{
            this.setState({
                passcheck : "1"
            });
        }
    }

    handleValue(e){
        const valchange = {};
        valchange[e.target.name] = e.target.value;
        this.setState(valchange);
    }

    render(){
        const {classes} = this.props
        return(
            <div>
                <Paper className={classes.mainWindow}>
                    <h1 className={classes.HeadLine}>설치</h1>
                    <Box border={1} title="관리자 설정" className={classes.box1}>
                        <TextField id="outlined-basic" className={classes.textLine} fullWidth="true" variant='outlined' label="관리자 아이디" name="admUserID" onChange={this.handleValue}></TextField>
                        <TextField id="outlined-basic" className={classes.textLine} fullWidth="true" type="password" variant='outlined' label="관리자비밀번호" name="admUserPass" onChange={this.handleValue}></TextField>
                        <TextField id="outlined-basic" className={classes.textLine} fullWidth="true" type="password" variant='outlined' label="비밀번호 확인" name="admUserck" onChange={this.handleValue}></TextField>
                    </Box>
                    <Box border={1} title="관리자 설정" className={classes.box2}>
                        <TextField id="outlined-basic" className={classes.textLine} fullWidth="true" variant='outlined' label="SQL주소" name="DBAdd" onChange={this.handleValue} value={this.state.DBAdd}></TextField>
                        <TextField id="outlined-basic" className={classes.textLine} fullWidth="true" variant='outlined' label="SQL포트" name="DBPort" onChange={this.handleValue} value={this.state.DBPort}></TextField>
                        <TextField id="outlined-basic" className={classes.textLine} fullWidth="true" variant='outlined' label="DB명" name="DBname" onChange={this.handleValue}></TextField>
                        <TextField id="outlined-basic" className={classes.textLine} fullWidth="true" variant='outlined' label="DB유저 아이디" name="DBid" onChange={this.handleValue}></TextField>
                        <TextField id="outlined-basic" className={classes.textLine} fullWidth="true" type="password" variant='outlined' name="DBPass" label="DB유저비밀번호" onChange={this.handleValue}></TextField>
                        <Button onClick={this.dbCheck} color="default" variant="contained" className={classes.btnDB}>DB연결 확인</Button>
                        {this.dbcheckText()}
                    </Box>
                    <Box className={classes.box3}>
                        <Button color="default" variant="contained" className={classes.confirmd} disabled={this.state.installck} onClick={this.setCloud}>설치</Button>
                        {this.checkText()}
                    </Box>
                </Paper>
            </div>
        )
    }

}

export default withStyles(styles)(Installpage)