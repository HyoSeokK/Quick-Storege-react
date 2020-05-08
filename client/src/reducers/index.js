import { combineReducers } from 'redux';
import FileList from './fileList';
import PathSet from './pathSet';
import SelectFile from './selectFile';

const rootReducer = combineReducers({
  FileList,
  PathSet,
  SelectFile
});

export default rootReducer;
