import { combineReducers } from 'redux';
import FileList from './fileList'

const rootReducer = combineReducers({
  Filelists : FileList,
});

export default rootReducer;
