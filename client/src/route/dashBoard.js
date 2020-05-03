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
import FileList from '../containers/fileList';
import FileDetail from '../containers/fileDetail';
import './css/dashBoard.css';

class FileSystem extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loginuser : this.props.loginuser
        }
        this.logout = this.logout.bind(this);
    }
    logout(){
        window.sessionStorage.removeItem('user');
        this.props.logoutfunc();
    }
    ListItemLink(props) {
        return <ListItem button component="a" {...props} />;
      }

    componentWillMount(){
        this.setState({
            loginuser : window.sessionStorage.getItem('user')
        })
    }
    render(){
        console.log(this.state.loginuser);
        return(
            <div className='dashBoard'>
                <Grid container spacing={1}>
                    <Grid item xs>
                        <List component="nav" aria-label="main mailbox folders">
                            <ListItem button>
                            <ListItemIcon>
                                <InboxIcon />
                            </ListItemIcon>
                            <ListItemText primary="내 파일" />
                            </ListItem>
                            <ListItem button>
                                <ListItemIcon>
                                    <ShareIcon />
                                </ListItemIcon>
                                    <ListItemText primary="공유폴더" />
                            </ListItem>
                        </List>
                        <Divider />
                        <List component="nav" aria-label="secondary mailbox folders">
                            <ListItem button>
                                <ListItemIcon>
                                    <PowerSettingsNewIcon />
                                </ListItemIcon>
                                <ListItemText primary="Logout" onClick={this.logout}/>
                            </ListItem>
                        </List>
                    </Grid>
                    <Grid item xs={8}>
                        {/* 여기가 리스트 들어갈곳! */}
                        <FileList/>
                    </Grid>
                    <Grid item xs={2}>
                        {/* 여기는 파일 상세정보 */}
                        <FileDetail />
                    </Grid>
                </Grid>
            </div>
        )
    }

}

export default FileSystem;