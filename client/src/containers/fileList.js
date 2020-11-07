import React from 'react';

import {DialogTitle, Breadcrumbs, Link, TableContainer, Table, TableHead, TableRow,TableCell, TableBody, Checkbox, Paper, styled ,makeStyles, withStyles, Button,Typography, LinearProgress, Modal, Dialog, DialogContentText, DialogActions, DialogContent,TextField} from '@material-ui/core';


import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import './css/fileList.css';
import FileListDetail from '../containers/listdetail'
import DescriptionIcon from '@material-ui/icons/Description';
import List from './list.js'


import Axios, {post} from 'axios'


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
        this.handelClick = this.handelClick.bind(this);
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.ceateFile = this.ceateFile.bind(this);
        this.handleValue = this.handleValue.bind(this);
        this.handlefilevalue = this.handlefilevalue.bind(this);
        this.state = {
            files : null,
            filesname : null,
            uploadpercent : 0,
            count : 0,
            open : false,
            setOpen : false,
            fordername : ''
        }
    }
    
    // 이름 : renderpathlink
    // 역할 : redux에 저장되있는 path링크를 분해하여 현재 이동 경로를 표시한다.
    // 개선사항: 필요 너무많은 이동을 했을때 처리방향?
    renderpathlink(){
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
    //파일 업로드 핸들링 부분
    //
    async uploadfile(file){
        const url = `/upload/data`;
        const uploaddata = new FormData();
        uploaddata.append('path',this.props.path);
        uploaddata.append('file',file);
        console.log("this.state.file");
        console.log(this.state.file);
        const config = {
            headers:{
                'content-type': 'multipart/form-data'
            },
            // 현재 파일의 진행척도를 보여주는 부분이다
            onUploadProgress: (ProgressEvent)=>{
                const {loaded, total } =ProgressEvent;
                let percent = Math.floor((loaded * 100)/total)
                // 현재 전송한 전송량과 전체 데이터의 양을 비교하여 퍼센트로 보여주는 부분
                // Math.floor를 통한 퍼센트에이지 나타내는 부분
                // console.log( `${loaded}kb of ${total}kb | ${percent}%`);
                // 이러한 전송량을 시각적으로 보여주기위해 해당페이지의 uploadpercent에 데이터를 넣어
                // 전송량을 보여주는 곳에서 표현할수있게 준비한다
                this.setState({
                    uploadpercent : percent
                })

                
            }
        };
        await post(url,uploaddata,config)
        this.getFFileList(this.props.path);
    }
    async getFFileList(path){
        try{
            await this.props.FileListAction.getFileList(path);
            this.setState({fileList : this.props.fileList})
        }catch(e){
            throw(e);
        }
    }


    // 이름 :  HandleFile
    // 역할 :  FileUpload를 담당
    // 2020-05-26
    // 동작절차
    // 1. handleFile InputTag File 파일이 들어오는것을 확인
    // 2. 들어온 파일 files안에 넣음
    // 3. files 리스안에 있는 파일을 차례로 전송
    // 4. 전송이 끝나면 다시 FileList를 출력한다.
    async handleFile(e){
        let i;
        let files = e.target.files;
        if(files){
           await this.setState({
                files: files,
                filesname : e.target.value
            });
            for(i = 0; i < files.length; i++){
                this.setState({
                    uploadpercent : 0,
                    count : i
                })
                await this.uploadfile(files[i])
            }
            this.handlefilevalue();
        }else{
            await this.setState({
                files: null,
                filesname : null
            });
        }
    }
    // 이름 : handlefilevalue
    // 역할 : 파일 전송이 완료가 되었을때 모든 데이터를 초기화
    //       시키기위한 함수
    handlefilevalue(){
        this.setState({
            files: null,
            filesname : "",
            count : 0,
            uploadpercent : 0,
        });
    }
    handelClick(e){
        e.preventDefault();
    }
    // Diallog Controller
    // const [open, setOpen] = React.useState(false);
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
    // 이름 : ceateFile
    // 역할 : 폴더이름을 서버에 전송하여 폴더를 생성하게 만든다
    //       1. Url 지정
    //       2. Axios를 통해 폴더명과 현재경로 전달
    //       3. 전송데이터 확인후 폴더가 생성되면 파일리스트 재호출
    //       4. Dialog 형식의 팝업창이기 떄문에 창닫기 위해 openFaile
    async ceateFile(){
        let url = '/createforder/'
        let check = Axios.post(url,{path:this.props.path,fordername:this.state.fordername})
        await this.getFFileList(this.props.path);
        this.setState({
            fordername : '',
            open : false
        })
    }
    // 이름 : handleValue
    // 역할 : 텍스트 필드의 데이터값을 컨트롤 하는 역할
    handleValue(e){
        const valchange = {};
        valchange[e.target.name] = e.target.value;
        this.setState(valchange);
    }

    //
    render(props){
        return(
            <div className="dirlist">
                <form onSubmit={this.submitHandle}>
                <input type="file"  id="upload-file" file={this.state.files} value={this.state.filesname} onChange={event => this.handleFile(event)} style={{ display: "none" }} 
                multiple/>
                    { this.state.files ? 
                    <div><LinearProgress variant="determinate" value={this.state.uploadpercent}></LinearProgress>{this.state.uploadpercent}% {this.state.count}/{this.state.files.length} </div> : 
                    <div>
                        <label htmlFor="upload-file">
                            <Button color='default' variant="contained" component="span"> 
                                업로드
                            </Button>
                        </label>
                        <Button color='default' variant="contained" onClick={event => this.handleClickOpen()}> 
                                폴더생성
                        </Button>
                        <Dialog open={this.state.open} onClose={event => this.handleClose()} aria-labelledby="form-dialog-title">
                            <DialogTitle id="form-dialog-title">폴더생성</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    생성할 폴더의 이름을 입력 해주세요
                                </DialogContentText>
                                <TextField type="text" label="ForderName" name="fordername" value={this.state.fordername} onChange={this.handleValue} />
                            </DialogContent>
                            <DialogActions>
                            <Button onClick={event => this.handleClose()} color="primary">
                                취소
                            </Button>
                            <Button onClick={event => this.ceateFile()} color="primary">
                                생성
                            </Button>
                            </DialogActions>
                        </Dialog>
                    </div>
                    }
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