import React from 'react'
import { withStyles, Grid,Button, Dialog, DialogContentText, Fade, TextField, Grow, TextareaAutosize } from '@material-ui/core'
import Axios from 'axios'
import { Alert, AlertTitle } from '@material-ui/lab'
import ext from '../module/extension'



const styles = theme => ({
    mainWrapper : {
        margin : "0 auto",
        padding : "0",
        height : "53em",
        overflow:"hidden"
    },
    thumbnail : {
        maxWidth : "200em",
        height : "20em",
    },
    contentsbox : {
        margin : "0 auto",
        height : "90em",
        textAlign : "center"
    },
    btnbox:{
        height : "5em"
    },
    downbutton : {
        height : "5em"
    },
    delta : {
        height :"10em",
        margin : "0"
    },
    imageMag : {
        margin : '50px',
        textAlign: "center",
    },
    dialog : {
        textAlign: "center"
    },
    centerMedia : {
        display : "block",
        margin : "0 auto"
    }

})


class Linkview extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            filename : '',
            filepath : '',
            password : '',
            passon : false,
            passcheck : false,
            ipass : '',
            warnon : 0 ,
            ext : '',
            isnone : '2',
        }
        this.handlValue = this.handlValue.bind(this);
        this.passcheck = this.passcheck.bind(this);
        this.renderPassWarn = this.renderPassWarn.bind(this);
        this.datareturn = this.datareturn.bind(this);
        // this.sumnailRender = this.sumnailRender.bind(this);
        this.player = this.player.bind(this);

    }
    componentDidMount(){
        console.log();
        this.datareturn()
    }

    async datareturn(){
        let link = this.props.match.params.id;
        let url = '/api/extview/' + link
        let data = await Axios.get(url)
        if(data.data.isnone == 1){
            this.setState({
                isnone : '1',
                filename : "file is None",
                passcheck : true
            })
            
        }
        else if(data.data.pass != ''){
            this.setState({
                isnone : '0',
                filename : data.data.filename,
                filepath : data.data.filepath,
                password : data.data.pass,
                ext : data.data.extension,
                passon : true,
                passcheck : true
            })
           
        }else{
            this.setState({
                filename : data.data.filename,
                filepath : data.data.filepath,
                password : data.data.pass,
                ext : data.data.extension,
                isnone : '0',
            })
           
        }
        
    }

    async filedownload(filename,filepath){
        //Axios를 통해 서버 파일링크에 접속한후에 파일에 대한 데이터를 서버로부터 전달받는다.
        //이떄 type blob <= 좀더 나중에 세밀하게 거치기 위해서는 정확한 타입 선정을 해야된다
        return Axios.post(`/download/${filename}`, {path : filepath},{responseType:"blob"})
        .then((res)=>{
            var data = new Blob([res.data])
            //window IE 낮은버전에서 작동하기위한 코드
            if(typeof window.navigator.msSaveBlob ==='function'){
                window.navigator.msSaveBlob(data,filename);
            }else{
                var blob = data;//파일 관련 데이터
                var link = document.createElement('a');//a태그인 다운로드 링크 생성
                //link 안에 있는 주소값을 우리가 다운받을 파일에 링크와 연결
                link.href = window.URL.createObjectURL(blob);
                //파일 다운로드 할떄 파일명 지정
                link.download = filename;
                //실제 적용되는 문서에 해당 링크 저장 할수있게 지정
                document.body.appendChild(link);
                //링크 클릭하여 다운로드 진행
                link.click();
            }
        }).catch((error)=>{
            console.log(error);
        })
    }
    handlValue(e){
        const valchange = {};
        valchange[e.target.name] = e.target.value;
        this.setState(valchange);
    }
    passcheck(){
        if(this.state.ipass == this.state.password){
            this.setState({
                passon : false,
                passcheck : false,
                warnon : 0
            })
        }else{
            this.setState({
                ipass : '',
                warnon : 1
            })
        }
    }
    renderPassWarn(){
        if(this.state.warnon == 1){
            return(
                <Grow
                in={this.state.warnon == "1"}
                style={{ transformOrigin: '0 0 0' }}
                {...(this.state.warnon == "1" ? { timeout: 1000 } : {})}
                >
                    <Alert severity="error">
                    <AlertTitle>에러!!!!!</AlertTitle>
                    비밀번호가 일치 하지 않습니다. — <strong>재입력 바랍니다!</strong>
                </Alert>
                </Grow>
            
            )
            

        }
    }
    player(){
        console.error(this.state.isnone);
        if(this.state.isnone== '0'){
        let extck = ext(this.state.ext )
        const {classes} = this.props;
                if(extck === "img"){
                    const filepath = `/storege${this.state.filepath}/${this.state.filename}`
                    console.log(`들어오고${filepath}`);
                    return(
                        <img className={classes.centerMedia} src={filepath}  width="640" height="auto"/>
                    )
                }else if(extck === 'video'){
                    const filepath = `/storege${this.state.filepath}/${this.state.filename}`
                    return(
                    <video className={classes.centerMedia} controls  width="640" height="480">
                        <source src={filepath}></source>
                    </video>
                    )
                  
                }else{
                    return(
                        <img src="/data/썸네일.jpg" className={classes.thumbnail}/>
                    )
                }
        }else if(this.state.isnone == '1'){
            const {classes} = this.props;
            return(
                <div>
                <img src="/data/nodata.jpg" className={classes.thumbnail}/>
                여기로 낑김
                </div>
            )
        }
    }

    // shouldComponentUpdate(nextProps,nextState){
    //     if(this.state.isnone != nextState.isnone
    //         || this.state.filename != nextState.filename
    //         || this.state.filepath != nextState.fil
    //         || 
    //         || ){
    //         return true;
    //     }
    // }


    render(){
        const {classes} = this.props
        return(
            <div className={classes.mainWrapper}>
                
                <Dialog open={this.state.passon} fullWidth={true} maxWidth={"md"}>
                    <DialogContentText>페스워드 처리</DialogContentText>
                    <TextField type="text" name="ipass" value={this.state.ipass} onChange={e => this.handlValue(e)}></TextField>
                    <Button onClick={event => this.passcheck()}>PassCheck</Button>
                    {this.renderPassWarn()}
                </Dialog>
                
                <Grid container={true} spacing={0} className={classes.contentsbox}>
                    <Grid item={true} xs={12} className={classes.delta}>
                         {this.player()}
                        <h2>{this.state.filename}</h2>
                    </Grid>
                    <Grid item={true} xs={12} className={classes.btnbox}>
                        <Button color="primary" variant="contained" disabled={this.state.passcheck  } onClick={() => this.filedownload(this.state.filename,this.state.filepath)} fullWidth className={classes.downbutton}>다운로드</Button>
                    </Grid>
                </Grid>

            </div>
        )
    }


}

export default withStyles(styles)(Linkview)