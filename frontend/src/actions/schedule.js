import * as actionTypes from '../utils/actionTypes';

export const changeDay = (day) => ({
  type: actionTypes.CHANGE_DAYS,
  day: day,
});

export const changeSchedule = (enable) => ({
  type: actionTypes.ENABLE_SCHEDULE,
  enable: enable,
});

export const changeTime = (e) => ({
  type: actionTypes.CHANGE_TIME,
  time: e.target.value,
});
