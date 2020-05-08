import {handleActions} from 'redux-actions'
import Axios from 'axios';

const GET_POST_PENDING = 'GET_POST_PENDING';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS';
const GET_POST_FAILURE = 'GET_POST_FAILURE';

function getfirstFetch(path){
  return Axios.post('/api/list/',{path : path})
}
export const getFileList = (path) => dispatch => {
  
  // 먼저, 요청이 시작했다는것을 알립니다
  dispatch({type: GET_POST_PENDING});

  // 요청을 시작합니다
  // 여기서 만든 promise 를 return 해줘야, 나중에 컴포넌트에서 호출 할 때 getPost().then(...) 을 할 수 있습니다
  return getfirstFetch(path).then(
      (response) => {
          // 요청이 성공했을경우, 서버 응답내용을 payload 로 설정하여 GET_POST_SUCCESS 액션을 디스패치합니다.
          dispatch({
              type: GET_POST_SUCCESS,
              payload: response
          })
      }
  ).catch(error => {
      // 에러가 발생했을 경우, 에로 내용을 payload 로 설정하여 GET_POST_FAILURE 액션을 디스패치합니다.
      dispatch({
          type: GET_POST_FAILURE,
          payload: error
      });
  })
}
  const initialState = {
    pending: false,
    error: false,
    data: [
      {
        "id": 1,
        "name": "이거 폴더 맞는데",
        "date": "Fri May 01 2020 08:53:08 ",
        "isFile": false,
        "size" : "",
        "extension" : "nodata"
        },
    ]
    

}

  export default handleActions({
    [GET_POST_PENDING]: (state, action) => {
      return {
          pending: true,
          error: false
      };
    },
    [GET_POST_SUCCESS]: (state, action) => {
      const data = action.payload.data
      console.log(data);
      if(data.data == "nodata"){
        console.log("데이터가 없음");
        return {
          pending:false,
          data:[
            {
              "id": 1,
              "name": "데이터가 없음",
              "date": "notfound",
              "isFile": false,
              "size" : "",
              "extension" : "nodata"
            }
          ]
        }
      }else{
        console.log("여기가 접근됨");
        return {
            pending: false,
            data: data
        };}
    },
    [GET_POST_FAILURE]: (state, action) => {
        return {
            pending: false,
            error: true
        }
    }
  }, initialState)
  