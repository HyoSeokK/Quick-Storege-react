import React from 'react'
import { connect} from 'react-redux';
import { bindActionCreators,compose } from 'redux';
import { Grid, Paper, withStyles, List, ListItem, Avatar, ListItemAvatar, ListItemText } from '@material-ui/core';
import * as pathAction from '../reducers/pathSet'
import * as selectFile from '../reducers/selectFile'
import './css/fileDetail.css';
import TitleIcon from '@material-ui/icons/Title';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import SettingsIcon from '@material-ui/icons/Settings';

const styles = theme => ({
    imageMag : {
        margin : '50px',
        textAlign: "center",
    },
});


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
        // 여기서는 setState 를 하는 것이 아니라
        // 특정 props 가 바뀔 때 설정하고 설정하고 싶은 state 값을 리턴하는 형태로
        // 사용됩니다.
        if (nextProps.file !== prevState.file) {
          return { file: nextProps.file };
        }
        return null; // null 을 리턴하면 따로 업데이트 할 것은 없다라는 의미
      }

    shouldComponentUpdate(newProps,newState){
        if(this.props.file !== newProps.file){
            return true
        }else{
            return false
        }
    }


    selfileimage(){
        const {classes} = this.props
        if(!this.props.file){
            console.log("왼쪽 파일 상세설명 부");
            return(
                <Grid item xs={12} className={classes.imageMag} align="center">
                        <img src="/data/nodata.jpg" className='imagectr'/>
                </Grid>
                )
        }else if(this.props.file.extension === "jpg"){
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