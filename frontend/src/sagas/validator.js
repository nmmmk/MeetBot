import { select, put, takeLatest } from 'redux-saga/effects';
import * as actionTypes from '../utils/actionTypes';
import * as validator from '../actions/validator';

export function* requestTextValidating() {
  yield takeLatest(actionTypes.REQUEST_TEXT_VALIDATE, validateText);
}

export function* requestQuestionsValidating() {
  yield takeLatest(actionTypes.REQUEST_QUESTIONS_VALIDATE, validateQuestions);
}

export function* requireScheduleValidating() {
  yield takeLatest(actionTypes.REQUEST_SCHEDULE_VALIDATE, validateSchedule);
}

export function* requireChannelParticiantsValidating() {
  yield takeLatest(
    actionTypes.REQUEST_CHANNEL_PARTICIPANTS_VALIDATE,
    validateChannelParticipants
  );
}

export function* validateText(action) {
  var isError = false;

  var value = action.value.trim();
  if (value === '') {
    yield put(validator.setValid(action.key, true, 'required'));
    isError = true;
  } else {
    yield put(validator.setValid(action.key, false, ''));
  }

  return isError;
}

export function* validateQuestions() {
  const state = yield select();

  if (state.messages.questions.length === 0) {
    yield put(
      validator.setValid('questions', true, '1つ以上の質問を入力してください')
    );
    return true;
  }

  var isQuestion = true;
  state.messages.questions.map((question) => {
    if (question.text.trim().length === 0) {
      isQuestion = false;
    }
  });
  if (isQuestion === false) {
    yield put(validator.setValid('questions', true, '質問を入力してください'));
    return true;
  }

  yield put(validator.setValid('questions', false, ''));

  return false;
}

export function* validateSchedule() {
  const state = yield select();

  if (state.schedule.enable === false) {
    yield put(validator.setValid('schedule', false, ''));

    return false;
  }

  if (state.schedule.time === '') {
    yield put(validator.setValid('schedule', true, 'timeを入力してください'));
    return true;
  }

  if (
    state.schedule.days.Mon === false &&
    state.schedule.days.Tue === false &&
    state.schedule.days.Wed === false &&
    state.schedule.days.Thu === false &&
    state.schedule.days.Fri === false &&
    state.schedule.days.Sat === false &&
    state.schedule.days.Sun === false
  ) {
    yield put(
      validator.setValid('schedule', true, '1つ以上の曜日を選択してください')
    );
    return true;
  }

  yield put(validator.setValid('schedule', false, ''));
  return false;
}

export function* validateChannelParticipants() {
  const state = yield select();

  if (state.slackSettings.channel.selected === '') {
    yield put(
      validator.setValid(
        'channelParticipants',
        true,
        'Broadcast channelを選択してください'
      )
    );

    return true;
  }

  if (state.slackSettings.members.selected.length === 0) {
    yield put(
      validator.setValid(
        'channelParticipants',
        true,
        'ミーティング参加者を選択してください'
      )
    );
    return true;
  }
  yield put(validator.setValid('channelParticipants', false, ''));

  return false;
}

export function* validateAll(state) {
  var isError = false;
  var temp = false;

  // Project Title
  temp = yield* validateText({
    key: 'projectTitle',
    value: state.messages.projectTitle,
  });
  isError = isError || temp;

  // Intro Message
  temp = yield* validateText({
    key: 'introMessage',
    value: state.messages.introMessage,
  });
  isError = isError || temp;

  // Broadcast channel & Participants
  temp = yield* validateChannelParticipants();
  isError = isError || temp;

  // Schedule
  temp = yield* validateSchedule();
  isError = isError || temp;

  // Questions
  temp = yield* validateQuestions();
  isError = isError || temp;

  // Outro Message
  temp = yield* validateText({
    key: 'outroMessage',
    value: state.messages.outroMessage,
  });
  isError = isError || temp;

  return isError;
}
