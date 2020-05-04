import axios from 'axios'
import * as types from './ActionTypes'

export const firstFetchFile = () =>({
    types: types.FirstFetchList
})



export function fetchFilelist(){
    const url = `/api/list`;
    const data = axios.get('/api/list').then(res => {
        console.log("data 전달");
         console.log(res.data);
         return res.data})
    console.log("데이터 꺼냈어용!");
    console.log(data);
    return{
        type: FETCH_FILE,
        payload : data
    };
}