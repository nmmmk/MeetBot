import { combineReducers } from 'redux';
import slackSettings from './slackSettings';
import schedule from './schedule';
import messages from './messages';
import progress from './progress';
import validation from './validation';
import snackbar from './snackbar';

const reducer = combineReducers({
  slackSettings,
  schedule,
  messages,
  progress,
  validation,
  snackbar,
});

export default reducer;
