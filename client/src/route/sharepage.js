import { Paper, Table, TableBody, TableCell, TableHead, TableRow,IconButton } from '@material-ui/core';
import DescriptionIcon from '@material-ui/icons/Description';
import GetAppIcon from '@material-ui/icons/GetApp'
import Axios from 'axios';
import React from 'react';


class SharePage extends React.Component{
    
    constructor(props){
        super(props)
        this.renderList = this.renderList.bind(this);
        this.filedownload = this.filedownload.bind(this);
        this.state ={
            fileList : ""
        };
    }
    async componentDidMount(){
        await this.shareList()
    }

    async shareList(){
        var url = "/api/sharefilelist";
        let data = await Axios.post(url, {user:window.sessionStorage.getItem('user')});
        console.warn(data.data);
        await this.setState({
            fileList : data.data
        })
        console.warn("체크를 위한 워닝");
        console.warn(this.state.fileList);
        console.warn(this.state.fileList.check);
        console.warn("체크를 위한 워닝");
    }
    // async shouldComponentUpdate(nextProps,nextState){
    //     if(this.state.fileList != nextState.fileList){
    //         await this.setState({
    //             fileList : nextState.fileList
    //         })
    //         return true;
    //     }
    // }

    //파일 관리 로직들 다운로드 / 삭제 
    //파일 다운로드 로직
    //작동 과정 
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


    renderList(){
        
        if(this.state.fileList == ""){
            return(
                <TableRow>
                        <TableCell>
                            
                        </TableCell>
                        <TableCell>
                            로딩중
                        </TableCell>
                        <TableCell>
                            
                        </TableCell>
                        <TableCell>
                            
                        </TableCell>
                    </TableRow>
            )
        }else if(this.state.fileList.check=="n") {
            return(
                <TableRow>
                        <TableCell>
                            
                        </TableCell>
                        <TableCell>
                            공유해준 데이터가 없습니다.
                        </TableCell>
                        <TableCell>
                            
                        </TableCell>
                        <TableCell>
                            
                        </TableCell>
                    </TableRow>
            )
        }else{
            return this.state.fileList.map((user)=>{
                return(
                    <TableRow>
                        <TableCell>
                            
                        </TableCell>
                        <TableCell>
                            {user.filename}
                        </TableCell>
                        <TableCell>
                            {user.shareuser}
                        </TableCell>
                        <TableCell>
                        <IconButton aria-label="download" onClick={()=>this.filedownload(user.filename, user.filepath)}>
                         <GetAppIcon ></GetAppIcon>
                     </IconButton>
                        </TableCell>
                    </TableRow>
                )
            })
        }
        

    }

    render(){
        return(
            <Paper>
                    <Table stickyHeader size="small" >
                        <TableHead>
                            <TableRow>
                                <TableCell style={{width:50}}>
                                    <DescriptionIcon />
                                </TableCell>
                                <TableCell align={"center"}>
                                    파일명
                                </TableCell>
                                <TableCell>
                                   소유자
                                </TableCell>
                                <TableCell>
                                   다운로드
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                        {/* 여기가 끝 */}
                            {this.renderList()}
                        </TableBody>
                    </Table>
            </Paper>
        )
    }

}

export default SharePage