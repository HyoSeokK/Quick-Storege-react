import React from 'react';
import { Breadcrumbs, Link, TableContainer, Table, TableHead, TableRow,TableCell, TableBody, Checkbox, Paper, styled ,makeStyles, withStyles} from '@material-ui/core';
import {connect} from 'react-redux'
import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import './css/fileList.css';
import FileListDetail from '../containers/listdetail'
import DescriptionIcon from '@material-ui/icons/Description';
import List from './list.js'





class FileList extends React.Component{
    constructor(props){
        super(props);

        this.renderpathlink = this.renderpathlink.bind(this);
    }

    // 이름 : renderpathlink
    // 역할 : redux에 저장되있는 path링크를 분해하여 현재 이동 경로를 표시한다.
    // 개선사항: 필요 너무많은 이동을 했을때 처리방향?
    renderpathlink(){
        console.log("상단 패스 링크 제작중");
        
        let i = 1;
        let link = [];
        for(i=1; i < this.props.path.split('/').length ; i++){
            console.log("짜르기 성공");
            link.push(this.props.path.split('/')[i]);
        }
        console.log(link);
        
        i = 1;
        return link.map((data)=>{
            return(
                <Link color="inherit">
                        {data}
                </Link>
            )
        })
    }
    render(props){
        return(
            <div className="dirlist">
                <Breadcrumbs aria-label="breadcrumb">
                    <HomeIcon />
                    {this.renderpathlink()}
                </Breadcrumbs>
                <List/>
            </div>
        )
    }

}

export default connect((state)=>({
    path : state.PathSet.path
    }),null)(FileList);