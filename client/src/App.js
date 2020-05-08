import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Customer from './components/customer';
import CustomerAdd from './components/customerAdd';
import axios from 'axios';
import { render } from '@testing-library/react';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import { TableCell, TableBody,TableRow,withStyles,Paper,CircularProgress, Grid } from '@material-ui/core';
import Login from './route/login'
import DashBoard from './route/dashBoard'
import Head from './Head/head'

import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Redirect} from 'react-router-dom';




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
      loginuser:"",
      customer : "",
      comple : 0,
      logcheck : 1
    }
    // this.callApi = this.callApi.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.logoutfunc = this.logoutfunc.bind(this);
  }
  
  logoutfunc(){
    this.setState({
      loginuser : ""
    })
  }

  changeUser(){
    this.setState({
      loginuser : window.sessionStorage.getItem('user')
    })
  }

  render() {
    const { classes } = this.props;
    console.log(this.state.loginuser);
      return (
        <div className="root">
          <Head loginuser={this.state.loginuser} logoutfunc={this.logoutfunc}/>
          <Router>
            {window.sessionStorage.getItem('user') ? <Redirect to="/dashboard"/> : <Redirect to="/login"/>}
            <Route path="/login" component={() => <Login logcheck={this.state.logcheck} loginuser={this.state.loginuser} changeUser={this.changeUser} />} />
            <Route path="/dashboard" component={() => <DashBoard loginuser={this.state.loginuser} logoutfunc={this.logoutfunc}/>}/>
          </Router>
        </div>
        
      );
    }
}
export default withStyles(styles)(App);



 