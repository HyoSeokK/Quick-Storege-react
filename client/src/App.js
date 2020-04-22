import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Customer from './components/customer';
import axios from 'axios';
import { render } from '@testing-library/react';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import { TableCell, TableBody,TableRow,withStyles,Paper,CircularProgress } from '@material-ui/core';

const styles = theme =>({
  root:{
    width: '100%',
    marginTop : theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth:1000
  },
  progress: {
    margin: theme.spacing.unit * 2
  }

})

class App extends Component {
  constructor(props){
    super(props);

    this.state ={
      customer : "",
      comple : 0
    }
    // this.callApi = this.callApi.bind(this);
  }
  /*
  life 사이클
    constroctor <- 데이터 생성부분

    componentwillMount

    render <- 실제 뷰 생성구간

    componentDidMount()


    props or state가 재설정 되는경우 => shouldComponentUpdate()
  */

  progress = () =>{
    const {comple} = this.state
    this.setState({comple:comple>=100 ? 0 : comple + 1});
  }

  componentDidMount(){
    if(this.state.customer == ""){
      this.timer = setInterval(this.progress,20);
    }
    this.callApi().then(res => this.setState({customer: res})).catch(err => console.log(err)
    )
    console.log(this.state.customer);
  }
  callApi = async () =>{
  try{
    const data = await axios.get('/api/customers');
    return data.data;
  }catch (err){
    console.log(err);
  }
  // const response = await fetch('/api/customers');
  // const body = await response.json();
  // console.log(body);
  // return body;
}
  render() {
    const { classes } = this.props;
    
      return (
          <Paper className={classes.root}>
            <Table className={classes.table}>
                  <TableHead>
                    <TableRow>
                    <TableCell>
                      ID
                    </TableCell>
                    <TableCell>
                      Image
                    </TableCell>
                    <TableCell>
                      이름
                    </TableCell>
                    <TableCell>
                      성별
                    </TableCell>
                    <TableCell>
                      주소
                    </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  {this.state.customer ? this.state.customer.map(c =>{return( <Customer key={c.id} id={c.id} name={c.name} image={c.image} gender={c.gender} address={c.address}/>)}) : 
                    <TableRow>
                      <TableCell colSpan="6" align="center">
                          <CircularProgress className={classes.progress} variant="determinate" value={this.state.comple}></CircularProgress>
                      </TableCell>
                    </TableRow>
                  }
                  </TableBody>
            </Table>
          </Paper>
      );
    } 
}

export default withStyles(styles)(App);
