import React from 'react';

import { Breadcrumbs, Link, TableContainer, Table, TableHead, TableRow,TableCell, TableBody, Checkbox, Paper, styled ,makeStyles, withStyles, Button} from '@material-ui/core';


import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import './css/fileList.css';
import FileListDetail from '../containers/listdetail'
import DescriptionIcon from '@material-ui/icons/Description';
import List from './list.js'


import {post} from 'axios'


import { bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import * as fileListAction from '../reducers/fileList'
import * as pathAction from '../reducers/pathSet'
import * as selectFile from '../reducers/selectFile'


class FileList extends React.Component{
    constructor(props){
        super(props);
        this.getFFileList = this.getFFileList.bind(this);
        this.renderpathlink = this.renderpathlink.bind(this);
        this.handleFile = this.handleFile.bind(this);
        this.state = {
            file : null,
            filename : ''
        }
    }
    
    // 이름 : renderpathlink
    // 역할 : redux에 저장되있는 path링크를 분해하여 현재 이동 경로를 표시한다.
    // 개선사항: 필요 너무많은 이동을 했을때 처리방향?
    renderpathlink(){
        console.log("상단 패스 링크 제작중");
        
        let i = 1;
        let link = [];
        for(i=1; i < this.props.path.split('/').length ; i++){
            link.push(this.props.path.split('/')[i]);
        }
        i = 1;
        return link.map((data)=>{
            return(
                <Link color="inherit">
                        {data}
                </Link>
            )
        })
    }

    submitHandle(e){
        e.preventDefault();
    }
    uploadfile(){
        const url = `/upload/data`;
        const uploaddata = new FormData();
        uploaddata.append('path',this.props.path);
        uploaddata.append('file',this.state.file);
        console.log("this.state.file");
        console.log(this.state.file);
        const config = {
            headers:{
                'content-type': 'multipart/form-data'
            }
        };
        console.log("file 들어갔나?");
        console.log(uploaddata);
        post(url,uploaddata,config)

    }
    async getFFileList(path){
        try{
            await this.props.FileListAction.getFileList(path);
            this.setState({fileList : this.props.fileList})
        }catch(e){
            throw(e);
        }
    }


    async handleFile(e){
        await this.setState({
            file: e.target.files[0],
            filename:e.target.value
        });

        await this.uploadfile()

        await this.getFFileList(this.props.path);
        
        await this.setState({
            file: null,
            filename:''
        })

    }

    render(props){
        return(
            <div className="dirlist">
                <form onSubmit={this.submitHandle}>
                    { this.state.file ? <div>전송중</div> :<input type="file" file={this.state.file} value={this.state.filename} onChange={this.handleFile}/>}
                </form>

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
    loading : state.FileList.pending,// 서버와의 통신중 상태(로딩)
    error : state.FileList.error,// 서버간의 문제가 생김
    fileList : state.FileList.data,// 실질 적인 데이터
    path : state.PathSet.path
    }),(dispatch)=>({
        // 설정된 리덕스 엑션 관리
        FileListAction : bindActionCreators(fileListAction,dispatch),
        PathAction : bindActionCreators(pathAction,dispatch),
        SelectFile : bindActionCreators(selectFile,dispatch)
    })
    )(FileList);