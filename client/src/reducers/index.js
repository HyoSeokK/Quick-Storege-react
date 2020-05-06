import { combineReducers } from 'redux';
import FileList from './fileList'
import PathSet from './pathSet'

const rootReducer = combineReducers({
  FileList,
  PathSet
});

export default rootReducer;
