import { select, put, takeEvery } from 'redux-saga/effects';
import S3Access from '../utils/aws/s3Access';
import CloudWatchEvents from '../utils/aws/cloudWatchEvents';
import { validateAll } from './validator';
import * as slack from '../utils/slack';
import * as progress from '../actions/progress';
import * as actionTypes from '../utils/actionTypes';
import * as snackbar from '../actions/snackbar';

export function* requestApplySettings() {
  yield takeEvery(actionTypes.REQUEST_APPLY_SETTINGS, applySettings);
}

export function* applySettings() {
  const state = yield select();

  var isError = yield* validateAll(state);
  if (isError === true) {
    return;
  }

  yield put(progress.showProgress(true));

  var param = {
    project: {
      name: '',
      startMessage: '',
      endMessage: '',
    },
    user: [],
    broadcastCh: '',
    questions: [],
  };

  param.project.name = state.messages.projectTitle;
  param.project.startMessage = state.messages.introMessage;
  param.project.endMessage = state.messages.outroMessage;

  state.messages.questions.map((question) => {
    param.questions.push({
      number: question.id,
      text: question.text,
      color: question.color,
    });
  });

  for (const member of state.slackSettings.members.selected) {
    const { response, error } = yield slack.getConversationsOpen(member.value);

    if (!error) {
      param.user.push({
        name: member.label,
        id: member.value,
        dmid: response.data.channel.id,
      });
    }
  }

  param.broadcastCh = state.slackSettings.channel.selected;
  const cwExpression = createCronString(state.schedule);

  var s3 = new S3Access();
  var cw = new CloudWatchEvents();

  var result = s3.upload('settings.json', JSON.stringify(param, undefined, 1));
  if (result.error) {
    console.log(result.error);
  }

  if (!result.error) {
    result = cw.putRule(state.schedule.enable, cwExpression);
    if (result.error) {
      console.log(result.error);
    }
  }

  // DynamoDbの情報も一旦クリアした方が良い

  yield put(progress.showProgress(false));

  if (result.error) {
    yield put(snackbar.openSnackbar('error', '更新に失敗しました'));
  } else {
    yield put(snackbar.openSnackbar('success', '更新に成功しました'));
  }
}

function createCronString(param) {
  var str = 'cron(';
  var time = param.time.split(':');
  var minute = Number(time[1]);
  var hour = Number(time[0]);

  // JST -> UTC
  hour -= 9;
  if (hour < 0) {
    hour += 24;
  }

  str += minute.toString();
  str += ' ';
  str += hour.toString();
  str += ' ';
  str += '?';
  str += ' ';
  str += '*';
  str += ' ';

  var date = '';
  if (param.days.Sun === true) {
    date += 'SUN';
  }
  if (param.days.Mon === true) {
    if (date) {
      date += ',';
    }
    date += 'MON';
  }
  if (param.days.Tue === true) {
    if (date) {
      date += ',';
    }
    date += 'TUE';
  }
  if (param.days.Wed === true) {
    if (date) {
      date += ',';
    }
    date += 'WED';
  }
  if (param.days.Thu === true) {
    if (date) {
      date += ',';
    }
    date += 'THU';
  }
  if (param.days.Fri === true) {
    if (date) {
      date += ',';
    }
    date += 'FRI';
  }
  if (param.days.Sat === true) {
    if (date) {
      date += ',';
    }
    date += 'SAT';
  }

  if (!date) {
    str += '?';
  } else {
    str += date;
  }
  str += ' ';
  str += '*';
  str += ')';

  return str;
}
