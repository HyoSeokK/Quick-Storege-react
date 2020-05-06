import {handleActions} from 'redux-actions'
const SET_PATH = 'SET_PATH'
const REMOVE_PATH = 'REMOVE_PATH'
const LOGOUT = 'LOGOUT'

export const setPath = (path) => dispatch => {
    dispatch({type:SET_PATH, payload:path})
}
export const removePath = (repath) => dispatch => {
    dispatch({type:REMOVE_PATH, payload:repath})
}
export const Logout = () => dispatch =>{
    dispatch({type:LOGOUT, payload:""})
}



const initialState ={
    path : ""
}

export default handleActions({
    [SET_PATH]:(state,action)=>{
        console.log("Path지정성공");
        return{
            path: state.path + "/" + action.payload
        };
    },
    [REMOVE_PATH]:(state,action)=>{
        return{
            path:action.payload
            }
        },
    [LOGOUT]:(state,actions) =>{
        console.log("LogOut호출됨");
        
        return{
            path:actions.payload
        };
    }
    }, initialState)