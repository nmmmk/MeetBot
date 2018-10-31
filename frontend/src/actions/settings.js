import * as actionTypes from '../utils/actionTypes';

export const requestLoadSettings = (state) => ({
  type: actionTypes.REQUEST_LOAD_SETTINGS,
});

export const fetchSettings = (schedule, messages, slackSettings) => ({
  type: actionTypes.FETCH_SETTINGS,
  schedule: schedule,
  messages: messages,
  slackSettings: slackSettings,
});

export const requestApplySettings = () => ({
  type: actionTypes.REQUEST_APPLY_SETTINGS,
});
