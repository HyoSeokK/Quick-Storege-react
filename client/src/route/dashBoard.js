import React from 'react';
import { Grid,List,ListItem} from '@material-ui/core';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemLink from '@material-ui/core/Listitem'
import Divider from '@material-ui/core/Divider';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import ShareIcon from '@material-ui/icons/Share';
import ComputerIcon from '@material-ui/icons/Computer';
import PersonIcon from '@material-ui/icons/Person';

import './css/dashBoard.css';
import { bindActionCreators,compose } from 'redux';
import {connect} from 'react-redux';
import * as pathAction from '../reducers/pathSet';
import * as selfile from '../reducers/selectFile';

import CloudService from './cloudService';
import Adminpage from './adminpage'
import ShareUser from './sharepage'
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import {Redirect, withRouter} from 'react-router-dom';

class FileSystem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loginuser : this.props.loginuser,
            change : 0
        }
        this.logout = this.logout.bind(this);
        this.renderMenu =this.renderMenu.bind(this)
        this.change = this.change.bind(this)
    }
    logout(){
        window.sessionStorage.removeItem('user');
        this.props.PathAction.Logout();
        this.props.SelFile.notFile();
        this.props.logoutfunc();
    }
    // ListItemLink(props) {
    //     return <ListItem button component="a" {...props} />;
    //   }

    componentWillMount(){
        
        this.setState({
            loginuser : window.sessionStorage.getItem('user')
        })
    }
    
    change(g){
        this.setState({
            change : g
        })
    }
    shouldComponentUpdate(nextProps,nextState){
        if(this.state.change != nextState.change){
            return true
        }
    }
    renderMenu(){
        if(this.state.change == 1){
            return(
                <ShareUser/>
            )
        }else if(this.state.change==2){
            return(
                <Adminpage/>   
            )
        }else if(this.state.change==0){
            return(
                <CloudService/>
            )
            
        }
    }

    render(){
        console.log(this.state.loginuser);
        return(
            <div className='dashBoard'>
                {!window.sessionStorage.getItem('user') && <Redirect to="/login"/>}
                <Grid container spacing={1}>
                    <Grid item xs>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem button onClick={event=>this.change(0)}>
                                {/* component={Link} to="/dashboard/"  */}
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="내 파일" />
                            </ListItem>
                            <ListItem button component={Link} onClick={event=>this.change(1)}>
                                {/* href="/dashboard/shareuser" to="/dashboard/shareuser"  */}
                                <ListItemIcon>
                                    <ShareIcon />
                                </ListItemIcon>
                                    <ListItemText primary="공유폴더" />
                            </ListItem>
                        </List>
                        <Divider />
                        <List component="nav" aria-label="secondary mailbox folders">
                            {window.sessionStorage.getItem("admin")==1 &&
                            <ListItem button onClick={event=>this.change(2)}>
                                {/* component={Link} href="/dashboard/admin" to="/dashboard/admin"  */}
                                <ListItemIcon>
                                    <PersonIcon />
                                </ListItemIcon>
                                <ListItemText primary="관리자 페이지"/>
                            </ListItem>
                            }
                            <ListItem button>
                                <ListItemIcon>
                                    <PowerSettingsNewIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" onClick={this.logout}/>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={10}>
                        {/* <Router>
                            <Switch>
                                <Route exact path="/dashboard/shareuser" component={ShareUser}/>
                                <Route exact path="/dashboard/admin" component={Adminpage}/>

                                <Route exact path="/dashboard" component={()=><CloudService/>}/>
                                <Route exact path="/dashboard/" component={()=><CloudService/>}/>
                            </Switch>
                        </Router> */}
                        {this.renderMenu()}
                    </Grid>
                </Grid>
            </div>
        )
    }

}


export default connect(null,(dispatch)=>({
    PathAction : bindActionCreators(pathAction,dispatch),
    SelFile : bindActionCreators(selfile,dispatch)
    })
)(FileSystem);

