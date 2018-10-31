import * as actionTypes from '../utils/actionTypes';

export const requestTextValidator = (e) => ({
  type: actionTypes.REQUEST_TEXT_VALIDATE,
  key: e.target.name,
  value: e.target.value,
});

export const requestQuestionsValidator = (e) => ({
  type: actionTypes.REQUEST_QUESTIONS_VALIDATE,
});

export const requestScheduleValidator = (e) => ({
  type: actionTypes.REQUEST_SCHEDULE_VALIDATE,
});

export const requestChannelParticipantsValidator = (e) => ({
  type: actionTypes.REQUEST_CHANNEL_PARTICIPANTS_VALIDATE,
});

export const setValid = (key, isError, message) => ({
  type: actionTypes.SET_VALID,
  key: key,
  isError: isError,
  message: message,
});
