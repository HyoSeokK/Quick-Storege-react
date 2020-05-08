import React, { Component } from 'react';

//마테리얼 UI 디자인 관련
import { Breadcrumbs, Link, TableBody, TableRow,TableCell,Checkbox, withStyles, Button} from '@material-ui/core';
import { sizing } from '@material-ui/system';
//

//아이콘 관련
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';
import HomeIcon from '@material-ui/icons/Home';
import FolderIcon from '@material-ui/icons/Folder';
import DashboardSharpIcon from '@material-ui/icons/DashboardSharp';
//

//리덕스 연결
import { bindActionCreators,compose } from 'redux';
import {connect} from 'react-redux';

import * as fileListAction from '../reducers/fileList'
import * as pathAction from '../reducers/pathSet'
import * as selectFile from '../reducers/selectFile'
//
import './css/fileList.css'


const styles = theme => ({
    link : {
        cursor:'pointer',
        '&:hover':{
            cursor:"pointer"
        },
    },
});




class FileListDetail extends Component{
    constructor(props){
        super(props)
        this.getFFileList = this.getFFileList.bind(this);
        this.renderback = this.renderback.bind(this);
        this.removePath = this.removePath.bind(this);
        this.state = {
            path : this.props.path,
            fileList : this.props.fileList
        }

    }
    // getSnapshotBeforeUpdate(nextProps,prevState){
    //     console.log("update 진행되나?");
    //     console.log(nextProps.path);
    //     console.log(prevState.path);
    //     if(prevState.path !== nextProps.path){
    //         return {
    //             path : nextProps.path,
    //             }
    //     }
    //     return null;
    // }

    // 재렌더링이 되는 시점을 컨트롤 하는부분입니다
    // FileList 목록을 기준으로 렌더링을 할지 말지를 컨트롤하여
    // 메모리소비를 억제합니다
    shouldComponentUpdate(newProps,newState){
        if(this.state.fileList !== newProps.fileList){
            return true
        }else{
            return false
        }
    }

    // componentDidMount는 초기에 컴포넌트가 마운트 될때 한번 실행됩니다.
    // 초기 실행시 기준은 회원의 ID 값이 되며 ID값을 통한 접근으로 파일목록을 출력합니다.
    componentDidMount(){
         console.log("리셋됨?");
         console.log(window.sessionStorage.getItem('user'));
         console.log(this.props.path);
        const ckpath = this.props.path.split('/');
        const ckuser = window.sessionStorage.getItem('user')
        console.log("상위폴더 체킹을 위한 데이터 확인--listdetail 59line");
        console.log(ckpath.length);
        console.log(ckpath);
        
        if(ckuser || ckpath[0] !== "" ){
            console.log(this.state.path); 
            this.getFFileList(this.state.path);
        }
    }
    
    ///////////////////////////////////////////////////////////////////
    // 비동기적으로 작동하는 부분입니다.

    // 이름 : getFFileList()
    // 역할 : 서버에서 파일 목록을 데려와서 Redux에 있는 FileList에 담는 역할을
    //       하는 함수입니다.
    async getFFileList(path){
        try{
            await this.props.FileListAction.getFileList(path);
            this.setState({fileList : this.props.fileList})
        }catch(e){
            throw(e);
        }
    }

    async listSelect(file){
        if(file.isFile){
            await this.props.SelectFile.selFile(file);
        }else if(!file.isFile){
            this.props.SelectFile.notFile();
            await this.props.PathAction.setPath(file.name);
            await this.getFFileList(this.props.path);
            if(this.state.path!==this.props.path){
                this.setState({path:this.props.path});
            }
        }
    }
    // 이름 : removePath()
    // 역할 : 가장 최상위에 있는 위치값을 삭제후 filelist 재호출 합니다
    // 1. path data 호출
    // 2. path / => 기준으로 split
    // 3. 0번 데이터는 "" 값이므로 1번 부터 호출
    // 4. length - 1 을 통해 최종 데이터는 repath에 값을 넣지 않음
    // 주의) 여기서 Path는 배열이 아닌 String 타입으로 관리를 하고 있습니다
    //      각 데이터마다 분류는 / 단위를 통해 하고 있고 String으로 관리를 하여
    //      서버와의 통신을 원할하게 불러오고 있습니다.
    async removePath(){
        let repath = "";
        let data = this.props.path.split('/');
        let length = data.length;
        for(let i = 1 ; i < length-1; i++){
            repath = repath + "/" + data[i];
        }
        await this.props.PathAction.removePath(repath);
        await this.getFFileList(this.props.path);
        if(this.state.path!==this.props.path){
            this.setState({path:this.props.path});
        }
    }

    ////////////////////////////////////////////////////////



    // 이름 : renderback()
    // 역할 : removepath를 호출하기위한 "상위폴더" 이동 버튼을 담고 있는 View
    renderback(){
        const {classes} = this.props;
        return(
            <TableRow hover className="rowtable" >
                    <TableCell align={"justify"} size="small">
                    </TableCell>
                    <TableCell align={"justify"} size="small">
                    </TableCell>
                    <TableCell>
                        <Link underline='none' color='inherit' onClick={() => this.removePath()} className={classes.link}>상위폴더</Link>
                         {/* 이곳에 이벤트를 넣어서 처리를 폴더이동및 파일 전송 을 시작한다 */}
                    </TableCell>
                    <TableCell>
                    </TableCell>
                    <TableCell>
                     <IconButton aria-label="download">
                     </IconButton>
                        <IconButton aria-label="Delete">
                     </IconButton>
                     </TableCell>
                </TableRow>
        )
    }


    // 이름 : renderList()
    // 역할 : getFileFFList를 통해 얻은 Redux안에 있는 File들을 종합하여 데이터를 View로 생성
    renderList(){
        const {classes} = this.props;
        console.log("파일 path");
        console.log(this.props.fileList);
        if(this.props.fileList[0].date =="notfound"){
            return(
                <div></div>
        )
        }else{
        return this.props.fileList.map((file)=>{
            return(
                <TableRow key={file.id} hover className="rowtable">
                    <TableCell align={"justify"} size="small">
                        <Checkbox></Checkbox>
                    </TableCell>
                    <TableCell align={"justify"} size="small">
                        {file.isFile ?  (file.extension == "jpg"? <ImageIcon style={{ fontSize: 20 }}/> : <DescriptionIcon style={{ fontSize: 20 }}/>):
                        <FolderIcon style={{ fontSize: 20 }}/>}
                    </TableCell>
                    <TableCell>
                        <Link underline='none' color='inherit' onClick={() => this.listSelect(file)} className={classes.link}>{file.name}</Link>
                         {/* 이곳에 이벤트를 넣어서 처리를 폴더이동및 파일 전송 을 시작한다 */}
                    </TableCell>
                    <TableCell>
                         {file.date}
                    </TableCell>
                    <TableCell>
                     <IconButton aria-label="download">
                         <GetAppIcon></GetAppIcon>
                     </IconButton>
                        <IconButton aria-label="Delete">
                        <DeleteIcon></DeleteIcon>
                     </IconButton>
                     </TableCell>
                </TableRow>

                
            )
        })}
    }

    render(){
        return(
            <TableBody>
                { (this.props.path.split('/')[1] == window.sessionStorage.getItem('user')&& this.props.path.split('/')[2]) && this.renderback()}
                {this.props.loading ? <div>로딩중</div> : this.renderList()}
            </TableBody>
        )
    }
}


export default compose(withStyles(styles),connect(
    (state)=>({
        loading : state.FileList.pending,// 서버와의 통신중 상태(로딩)
        error : state.FileList.error,// 서버간의 문제가 생김
        fileList : state.FileList.data,// 실질 적인 데이터
        path : state.PathSet.path // path데이터
    }),(dispatch)=>({
        // 설정된 리덕스 엑션 관리
        FileListAction : bindActionCreators(fileListAction,dispatch),
        PathAction : bindActionCreators(pathAction,dispatch),
        SelectFile : bindActionCreators(selectFile,dispatch)
    })
))(FileListDetail);