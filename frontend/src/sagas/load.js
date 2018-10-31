import { call, put, takeEvery } from 'redux-saga/effects';
import S3Access from '../utils/aws/s3Access';
import CloudWatchEvents from '../utils/aws/cloudWatchEvents';
import * as actionTypes from '../utils/actionTypes';
import * as slack from '../utils/slack';
import * as snackbar from '../actions/snackbar';
import * as slackActions from '../actions/slackSettings';
import * as setActions from '../actions/settings';
import * as progress from '../actions/progress';

export function* requestLoadSettings() {
  yield takeEvery(actionTypes.REQUEST_LOAD_SETTINGS, loadSettings);
}

export function* loadSettings() {
  var result = false;
  yield put(progress.showProgress(true));
  result = yield* getSlackInfo();
  if (result === true) {
    result = yield* fetchSettings();
  }
  yield put(progress.showProgress(false));

  if (result === false) {
    yield put(
      snackbar.openSnackbar(
        'error',
        'Loadエラーが発生しました。再ロードしてください。'
      )
    );
  }
}

export function* getSlackInfo() {
  // Publicチャンネル一覧取得
  var promise = yield call(slack.getChannelList);
  const channels = promise.response;
  if (promise.error) {
    console.log(promise.error);
    return false;
  }
  // Privateチャンネル一覧取得
  promise = yield call(slack.getGroupList);
  const groups = promise.response;
  if (promise.error) {
    console.log(promise.error);
    return false;
  }

  // ユーザー一覧取得
  promise = yield call(slack.getUserList);
  const users = promise.response;
  if (promise.error) {
    console.log(promise.error);
    return false;
  }

  // チャンネルリスト作成
  var channelList = [];
  channels.data.channels.forEach((data) => {
    if (data.is_archived === false) {
      channelList.push({ value: data.id, label: data.name });
    }
  });

  // groups.id, name, is_archived
  groups.data.groups.forEach((data) => {
    if (data.is_archived === false && data.is_mpim === false) {
      channelList.push({ value: data.id, label: data.name });
    }
  });

  // チャンネル毎のユーザー名振り分け
  var userListOfChannel = slack.getUserListOfChannel(channels, groups, users);

  yield put(slackActions.getSlackInfo(channelList, userListOfChannel));

  return true;
}

export function* fetchSettings() {
  // S3からsettings.jsonを取得して、現在値として反映
  // Cloudwatchから、スケジュール情報を取得する
  var s3 = new S3Access();

  var settings = yield call([s3, 'download'], 'settings.json');
  if (settings.error) {
    console.log(settings.error);
    return false;
  }
  var param = JSON.parse(settings.response.Body.toString());

  var cw = new CloudWatchEvents();
  var cwSettings = yield cw.getRule();
  if (cwSettings.error) {
    console.log(cwSettings.error);
    return false;
  }

  var messages = {
    projectTitle: '',
    introMessage: '',
    outroMessage: '',
    questions: [],
  };

  var slackSettings = {
    channel: '',
    members: [],
  };

  var schedule = {
    enable: false,
    days: {
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
      Sun: false,
    },
    time: '--:--',
  };

  messages.projectTitle = param.project.name;
  messages.introMessage = param.project.startMessage;
  messages.outroMessage = param.project.endMessage;

  param.questions.map((question) => {
    messages.questions.push({
      id: question.number,
      text: question.text,
      color: question.color,
    });
  });

  param.user.map((user) => {
    slackSettings.members.push({
      label: user.name,
      value: user.id,
    });
  });

  slackSettings.channel = param.broadcastCh;

  if (cwSettings.response.Rules[0].State === 'ENABLED') {
    schedule.enable = true;
  }

  var scheduleEx = cwSettings.response.Rules[0].ScheduleExpression;
  if (scheduleEx.indexOf('cron') === 0) {
    var cronParam = scheduleEx.substring(5, scheduleEx.length - 1).split(' ');

    var min = Number(cronParam[0]);
    var hour = Number(cronParam[1]);

    // UTC -> JST
    hour += 9;
    if (hour >= 24) {
      hour -= 24;
    }

    // 時間
    schedule.time = ('00' + hour).slice(-2) + ':' + ('00' + min).slice(-2);

    // SUN-SAT(1-7)
    var dayOfWeekTable = getCronDayOfWeek(cronParam[4]);

    schedule.days.Sun = dayOfWeekTable[0];
    schedule.days.Mon = dayOfWeekTable[1];
    schedule.days.Tue = dayOfWeekTable[2];
    schedule.days.Wed = dayOfWeekTable[3];
    schedule.days.Thu = dayOfWeekTable[4];
    schedule.days.Fri = dayOfWeekTable[5];
    schedule.days.Sat = dayOfWeekTable[6];
  }

  yield put(setActions.fetchSettings(schedule, messages, slackSettings));

  return true;
}

function getCronDayOfWeek(param) {
  var dayOfWeekTable = [false, false, false, false, false, false, false];

  var dayOfWeekIndex = {
    SUN: 1,
    MON: 2,
    TUE: 3,
    WED: 4,
    THU: 5,
    FRI: 6,
    SAT: 7,
  };

  // 全ての曜日が対象
  if (param === '*') {
    for (var key in dayOfWeekTable) {
      dayOfWeekTable[key] = true;
    }
    return dayOfWeekTable;
  }

  var dayOfWeek = param.split(',');
  for (var v of dayOfWeek) {
    if (v.indexOf('-') !== -1) {
      var temp = v.split('-');
      var index1 = 0;
      if (Number.isInteger(temp[0]) === false) {
        index1 = dayOfWeekIndex[temp[0]];
      } else {
        index1 = Number(temp[0]);
      }

      var index2 = 0;
      if (Number.isInteger(temp[1]) === false) {
        index2 = dayOfWeekIndex[temp[1]];
      } else {
        index2 = Number(temp[1]);
      }

      for (var i = index1 - 1; i < index2; i++) {
        dayOfWeekTable[i] = true;
      }
    } else {
      if (v === '1' || v === 'SUN') {
        dayOfWeekTable[0] = true;
      } else if (v === '2' || v === 'MON') {
        dayOfWeekTable[1] = true;
      } else if (v === '3' || v === 'TUE') {
        dayOfWeekTable[2] = true;
      } else if (v === '4' || v === 'WED') {
        dayOfWeekTable[3] = true;
      } else if (v === '5' || v === 'THU') {
        dayOfWeekTable[4] = true;
      } else if (v === '6' || v === 'FRI') {
        dayOfWeekTable[5] = true;
      } else if (v === '7' || v === 'SAT') {
        dayOfWeekTable[6] = true;
      }
    }
  }

  return dayOfWeekTable;
}
