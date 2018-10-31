import * as actionTypes from '../utils/actionTypes';
const initialState = {
  projectTitle: { isError: false, message: '' },
  introMessage: { isError: false, message: '' },
  outroMessage: { isError: false, message: '' },
  questions: { isError: false, message: '' },
  schedule: { isError: false, message: '' },
  channelParticipants: { isError: false, message: '' },
};

const validation = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_VALID:
      switch (action.key) {
        case 'projectTitle':
          return {
            ...state,
            projectTitle: {
              isError: action.isError,
              message: action.message,
            },
          };
        case 'introMessage':
          return {
            ...state,
            introMessage: {
              isError: action.isError,
              message: action.message,
            },
          };
        case 'outroMessage':
          return {
            ...state,
            outroMessage: {
              isError: action.isError,
              message: action.message,
            },
          };
        case 'questions':
          return {
            ...state,
            questions: {
              isError: action.isError,
              message: action.message,
            },
          };
        case 'schedule':
          return {
            ...state,
            schedule: {
              isError: action.isError,
              message: action.message,
            },
          };
        case 'channelParticipants':
          return {
            ...state,
            channelParticipants: {
              isError: action.isError,
              message: action.message,
            },
          };
      }
    default:
      return state;
  }
};

export default validation;
