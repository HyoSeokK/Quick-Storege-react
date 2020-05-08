import {handleActions} from 'redux-actions'

const SELECT_FILE = "SELECT_FILE";
const NOT_SELECTED = "NOT_SELECTED";

export const selFile = (file) => dispatch=>{
    dispatch({type:SELECT_FILE,payload:file})
}
export const notFile = (file) => dispatch=>{
    dispatch({type:NOT_SELECTED,payload:null})
}


const initialState = {
    file : null
}

export default handleActions({
    [SELECT_FILE]:(state,action)=>{
        return{
            file:action.payload
        };
    },
    [NOT_SELECTED]:(state,action)=>{
        return{
            file:action.payload
        };
    }

},initialState)