import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Axios from 'axios';
import { render } from '@testing-library/react';
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import { TableCell, TableBody,TableRow,withStyles,Paper,CircularProgress, Grid } from '@material-ui/core';
import Login from './route/login'
import DashBoard from './route/dashBoard'
import Head from './Head/head'
import Installpage from './route/install'
import Linkview from './route/view'
import {BrowserRouter as Router, Route, Switch,useHistory} from 'react-router-dom';
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
      setcheck : false,
      comple : 0,
      logcheck : 0,

    }
    // this.callApi = this.callApi.bind(this);
    this.changeUser = this.changeUser.bind(this);
    this.logoutfunc = this.logoutfunc.bind(this);
    this.loginAction = this.loginAction.bind(this);
    this.installexit = this.installcheck.bind(this);
    this.settingOn = this.settingOn.bind(this);
  }
  async componentDidMount(){
    await this.installcheck()
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
  loginAction(){
    if(window.sessionStorage.getItem('user')){
      return(
        <Route exact={true} path="/" component={() => <DashBoard loginuser={this.state.loginuser} logoutfunc={this.logoutfunc}/>}/>
      )
      }else{
        return(
          <Route exact={true} path="/" component={() => <Login logcheck={this.state.logcheck} loginuser={this.state.loginuser} changeUser={this.changeUser} />}/>
        )
      }
    };
  async installcheck(){
    const url = '/api/check';
    if(this.state.setcheck == false){
    await Axios.get(url).then((response) =>{
      if(response.data == "not"){
        this.setState({
          setcheck:false
        })
      }else if(response.data == "yes"){
        this.setState({
          setcheck:true
        })
      }
    })
  }

    console.warn("data is :"+this.state.setcheck);
  }
  
  settingOn(){
    this.setState({
      setcheck:true
    })
  }

  render() {
    const { classes } = this.props;
    const props = this.props
    console.log(this.state.loginuser);
      return (
        <div className="root">
          <Head loginuser={this.state.loginuser} logoutfunc={this.logoutfunc}/>
          { this.state.setcheck ? 
            <Router>
            {/* {window.sessionStorage.getItem('user') ? 
            <Redirect to="/dashboard"/> 
            : <Redirect to="/login"/>} */}
            <Switch>
              {window.sessionStorage.getItem('user') ? <Route exact path="/" component={() => <DashBoard loginuser={this.state.loginuser} logoutfunc={this.logoutfunc}/>}/>
               : <Route exact path="/" component={() => <Login logcheck={this.state.logcheck} loginuser={this.state.loginuser} changeUser={this.changeUser} />}/>}
               {/* 여기 수정 해야됨 session이 있으면 로그인 페이지 접근 안되게 변경하기 */}
              <Route exact path="/login" component={() => <Login logcheck={this.state.logcheck} loginuser={this.state.loginuser} changeUser={this.changeUser} />} />
              <Route exact path="/dashboard" component={() => <DashBoard loginuser={this.state.loginuser} logoutfunc={this.logoutfunc}/>}/>
              <Route exact path="/dashboard/*" component={() => <DashBoard loginuser={this.state.loginuser} logoutfunc={this.logoutfunc}/>}/>
              <Route exact path="/Linkview/:id" component={Linkview}/>
            </Switch>
          </Router>
            : 
            <Installpage settingOn={this.settingOn}/>
          }
        </div>
        
      );
    }
}
export default withStyles(styles)(App);



 