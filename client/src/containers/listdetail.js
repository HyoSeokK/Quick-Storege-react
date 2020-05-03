import React, { Component } from 'react';
import { Breadcrumbs, Link, TableBody, TableRow,TableCell,Checkbox} from '@material-ui/core';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';
import { bindActionCreators } from 'redux';
import {connect} from 'react-redux';
import FolderIcon from '@material-ui/icons/Folder';
import { sizing } from '@material-ui/system';
import DashboardSharpIcon from '@material-ui/icons/DashboardSharp';
import './css/fileList.css'
class FileListDetail extends Component{
    constructor(props){
        super(props)
    }
    renderList(){
        return this.props.fileList.map((file)=>{
            console.log(file);
            return(
                <TableRow key={file.id} hover className="rowtable">
                    <TableCell align={"justify"} size="small">
                        <Checkbox></Checkbox>
                    </TableCell>
                    <TableCell align={"justify"} size="small">
                        <FolderIcon style={{ fontSize: 20 }}/>
                    </TableCell>
                    <TableCell>
                         {file.name}
                         {/* 이곳에 이벤트를 넣어서 처리를 폴더이동및 파일 전송 을 시작한다 */}
                    </TableCell>
                    <TableCell>
                         {file.date}
                    </TableCell>
                    <TableCell>
                     <IconButton aria-label="download">
                         <GetAppIcon></GetAppIcon>
                     </IconButton>
                        <IconButton aria-label="download">
                        <DeleteIcon></DeleteIcon>
                     </IconButton>
                     </TableCell>
                </TableRow>
            )
        })
    }
    render(){
        return(
            <TableBody>
                {this.renderList()}
            </TableBody>
        )
    }
}
function mapStateToProps(state){
    return{
        fileList : state.Filelists
    };
}

export default connect(mapStateToProps)(FileListDetail);
