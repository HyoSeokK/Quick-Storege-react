import React, {Component} from 'react';
import {Grid} from '@material-ui/core';
import FileList from '../containers/fileList';
import FileDetail from '../containers/fileDetail';


export default class CloudService extends Component{

    constructor(props){
        super(props);
    }

    render(){
        return(
            <Grid container spacing={1}>
                <Grid item xs={9}>
                        {/* 여기가 리스트 들어갈곳! */}
                        <FileList/>
                </Grid>
                <Grid item xs={3}>
                        {/* 여기는 파일 상세정보 */}
                        <FileDetail />
                </Grid>
            </Grid>
        )
    }
}
