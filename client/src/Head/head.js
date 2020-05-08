import React from 'react';
import {CssBaseline, AppBar,IconButton,Typography,Toolbar,Button} from '@material-ui/core'

import { makeStyles } from '@material-ui/core/styles'
import { withStyles } from '@material-ui/core/styles';

import MenuIcon from '@material-ui/icons/Menu';

const useStyles = theme => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  });


class Head extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            loginuser : this.props.loginuser
        }
        this.logout = this.logout.bind(this);
    }
    
    
    logout(){
        window.sessionStorage.removeItem('user');
        this.props.logoutfunc();
    }

    render(){
        const {classes} = this.props;
        return(
            <div>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>

                        <Typography variant="h6" className={classes.title}>
                            QucikStroge
                        </Typography>
                        {window.sessionStorage.getItem('user') ? <Typography variant="h6" className={classes.user}>{window.sessionStorage.getItem('user')}님 오신것을 환영합니다</Typography> : ""}
                    </Toolbar>
                </AppBar>
            </div>
        )
    }
}

export default withStyles(useStyles)(Head)