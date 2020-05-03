import axios from 'axios';

export const FETCH_FILE = 'FETCH_FILE';

export default fetchFilelist(path){

    const url = `api/upload/${path}`;
    const request = axios.get(url);

    return{
        type: FETCH_FILE,
        payload : request
    };
}