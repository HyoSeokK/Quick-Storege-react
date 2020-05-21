import React from 'react'

//Redux 시스템
import { connect} from 'react-redux';
import { bindActionCreators,compose } from 'redux';
import * as pathAction from '../reducers/pathSet'
import * as selectFile from '../reducers/selectFile'


//UI 관련
import { Grid, Paper, withStyles, List, ListItem, Avatar, ListItemAvatar, ListItemText } from '@material-ui/core';
import './css/fileDetail.css';
import TitleIcon from '@material-ui/icons/Title';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';
import ext from '../module/extension'

//material UI 디자인 컨트롤
const styles = theme => ({
    imageMag : {
        margin : '50px',
        textAlign: "center",
    },
});




//이름 :FileDetail
//역할 : Redux 안에있는 fileistSel 값인 선택된 파일을 확인하고 상세페이지구성 
//최종 업데이트 일자 2020 05 08
// 1. 분석된 파일 분류후 size / name / date 등으로 표시
// 2. 이미지라면 원래 이미지 파일을 간단하게 보여줌
// 3. 파일 size는 bit 사이즈로 표기됨 
// 개선해야될 방향
// 1. size bit가 아닌 bite로 표기할수있게 설정
// 2. 이미지 뿐만 아니라 영상일때는 클릭시 영상 재생이 가능하도록 설정
class FileDetail extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            file : this.props.file
        }
        this.selfile= this.selfileimage.bind(this);
        this.selfilestat = this.selfilestat.bind(this);
    }


    componentDidMount(){

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        
        if (nextProps.file !== prevState.file) {
          return { file: nextProps.file };
        }
        return null;
      }
    
    //React에 핵심 잦은 rerender 작업을 방지하기위해서
    // FileDetail에 변동이 있을때만 렌더링 작업을 하라고 지시함
    shouldComponentUpdate(newProps,newState){
        if(this.props.file !== newProps.file){
            return true
        }else{
            return false
        }
    }

    //이름 : selfileimage , selfilestat
    //역할 : 파일 분석 및 데이터 맞는곳에 집어넣기
    //1. 들어온 파일에 데이터유무 파악
    //2. 데이터 없음 => Nodata 이미지 출력 및 텍스트로 Nodata 보여줌
    //3. 이미지 파일인지 분석 => 이미지 맞다 => 미리보기 이미지 및 데이터 사이즈 상세보여주기
    //4. 그외에 확장자 => 섬네일 출력 및 => 상세데이터 출력
    selfileimage(){
        const {classes} = this.props
        if(!this.props.file){
            console.log("왼쪽 파일 상세설명 부");
            return(
                <Grid item xs={12} className={classes.imageMag} align="center">
                        <img src="/data/nodata.jpg" className='imagectr'/>
                </Grid>
                )
        }else{   
            let extck = ext(this.props.file.extension)
            if(extck === "img"){
                const filepath = `/data${this.props.path}/${this.props.file.name}`
                console.log(`들어오고${filepath}`);
                return(
                    <Grid item xs={12}>
                        <img src={filepath} className='imagectr'/>
                    </Grid>
                )
            }else{
                return(
                <Grid item xs={12} className={classes.imageMag} align="center">
                        <img src="/data/istextdata.jpg" className='imagectr'/>
                </Grid>
                )
            }
        }
    }

    
    selfilestat(){
        const {classes} = this.props
        if(!this.props.file){
            return(
                <Grid item xs={12}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <TitleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="선택된 파일이 없습니다"/>
                        </ListItem>
                    </List>

                </Grid>
            )
        }else{
            return(
                <Grid item xs={12}>
                    <List>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <TitleIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="파일명" secondary={this.props.file.name}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <CalendarTodayIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="생성날짜" secondary={this.props.file.date}/>
                        </ListItem>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <SettingsIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary="파일크기(비트단위)" secondary={this.props.file.size}/>
                        </ListItem>
                    </List>

                </Grid>
            )
        }
    }
    /////////////////////////////////////////////////////////////////////////////////////////

    render(){
        return(
            <Grid container>
                {this.selfileimage()}
                {this.selfilestat()}
            </Grid>
        )
    }
}

export default compose(withStyles(styles),connect((state)=>({
    file : state.SelectFile.file,
    path : state.PathSet.path
}),null))(FileDetail);