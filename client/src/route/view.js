import React from 'react'
import { withStyles, Grid,Button } from '@material-ui/core'


const styles = theme => ({
    mainWrapper : {
        margin : "0 auto",
        padding : "0",
        height : "60em",
        overflow:"hidden"
    },
    thumbnail : {
        maxWidth : "200em",
        height : "20em",
    },
    contentsbox : {
        margin : "0 auto",
        height : "90em",
        textAlign : "center"
    },
    btnbox:{
        height : "5em"
    },
    downbutton : {
        height : "5em"
    }

})


class Linkview extends React.Component{

    constructor(props){
        super(props)
        this.state = {

        }
    }

    render(){
        const {classes} = this.props
        return(
            <div className={classes.mainWrapper}>
                <Grid container={true} spacing={0} className={classes.contentsbox}>
                    <Grid item={true} xs={12} >
                        <img src="/data/nodata.jpg" className={classes.thumbnail}/>
                        <h2>파일명</h2>
                    </Grid>
                    <Grid item={true} xs={12} className={classes.btnbox}>
                        <Button color="primary" variant="contained" fullWidth className={classes.downbutton}>다운로드</Button>
                    </Grid>
                </Grid>

            </div>
        )
    }


}

export default withStyles(styles)(Linkview)