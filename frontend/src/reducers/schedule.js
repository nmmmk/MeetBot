import * as actionTypes from '../utils/actionTypes';

const initialState = {
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

const schedule = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SETTINGS:
      return {
        ...state,
        enable: action.schedule.enable,
        time: action.schedule.time,
        days: action.schedule.days,
      };

    case actionTypes.ENABLE_SCHEDULE:
      return {
        ...state,
        enable: !action.enable,
      };
    case actionTypes.CHANGE_DAYS:
      state.days[action.day] = !state.days[action.day];

      return {
        ...state,
        days: {
          ...state.days,
        },
      };
    case actionTypes.CHANGE_TIME:
      return {
        ...state,
        time: action.time,
      };
    default:
      return state;
  }
};

export default schedule;
