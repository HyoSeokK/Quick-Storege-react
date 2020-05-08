import React from 'react';


//UI 관련
import { Breadcrumbs, Link, TableContainer, Table, TableHead, TableRow,TableCell, TableBody, Checkbox, Paper, styled ,makeStyles, withStyles} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import Divider from '@material-ui/core/Divider';
import GetAppIcon from '@material-ui/icons/GetApp';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import FileListDetail from '../containers/listdetail'
import DescriptionIcon from '@material-ui/icons/Description';


// css
import './css/fileList.css';





//파일 목록 리스트화를 진행햐면서
//일정이상 파일이 늘어났을때 게시판 스크롤링 처리
const styles = theme => ({
    table: {
        maxHeight:800,
        overflowX:"hidden",
        overflowY:"auto"
    },
});

// 이름 : List
// 역할 : 상세한 파일리스트 내용을 담는 테이블을 
//       가지고 있는곳
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
                            <FileListDetail />
                        {/* 여기가 끝 */}
                    </Table>
                </Paper>
            </div>
        )
    }
}

export default withStyles(styles)(List);