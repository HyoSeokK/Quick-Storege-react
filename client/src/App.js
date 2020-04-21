import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Customer from './components/customer'
import { render } from '@testing-library/react';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import { TableCell, TableBody,TableRow,withStyles,Paper } from '@material-ui/core';


const styles = theme =>({
  root:{
    width: '100%',
    marginTop : theme.spacing.unit * 3,
    overflowX: 'auto'
  },
  table: {
    minWidth:1000
  }

})

const cus = [
  {
  "id" : 1,
  "name" : "강효석",
  "image" : "https://placeimg.com/64/64/1",
  "gender" : "남",
  "address" : "의정부"
  }, 
  {
    "id" : 2,
    "name" : "강효석",
    "image" : "https://placeimg.com/64/64/any",
    "gender" : "남",
    "address" : "의정부"
    }, 
    {
      "id" : 3,
      "name" : "강효석",
      "image" : "https://placeimg.com/64/64/any",
      "gender" : "남",
      "address" : "의정부"
      }, 
]


class App extends Component {


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
                  {cus.map(c =>{return( <Customer key={c.id} id={c.id} name={c.name} image={c.image} gender={c.gender} address={c.address}/>)})}
                  </TableBody>
            </Table>
          </Paper>
      );
    } 
}

export default withStyles(styles)(App);
