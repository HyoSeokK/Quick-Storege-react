import React from 'react';
import { Breadcrumbs, Link, TableContainer, Table, TableHead, TableRow,TableCell, TableBody, Checkbox, Paper, styled ,makeStyles, withStyles} from '@material-ui/core';

import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import './css/fileList.css';
import FileListDetail from '../containers/listdetail'
import DescriptionIcon from '@material-ui/icons/Description';





const styles = theme => ({
    table: {
        maxHeight:800,
        overflowX:"hidden",
        overflowY:"auto"
    },
});


class List extends React.Component{
    constructor(props){
        super(props)
        this.state={
        }
    }
    render(props){
        const {classes} = this.props;
        return(
            <div className="flist">
                <Paper className={classes.table}>
                    <Table stickyHeader size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{width:50}}>
                                    
                                </TableCell>
                                <TableCell style={{width:50}}>
                                    <DescriptionIcon />
                                </TableCell>
                                <TableCell align={"center"}>
                                    이름
                                </TableCell>
                                <TableCell>
                                    날짜
                                </TableCell>
                                <TableCell>
                                   파일설정
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        {/* 여기서부터 FileList 시작 */}
                        {/* <TableBody >  
                            <TableRow hover>
                                <TableCell>
                                    <Checkbox></Checkbox>
                                </TableCell>
                                <TableCell>
                                    족제비.avi
                                </TableCell>
                                <TableCell>
                                    2020.04.29
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
                        </TableBody> */}
                            <FileListDetail />
                        {/* 여기가 끝 */}
                    </Table>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(List);