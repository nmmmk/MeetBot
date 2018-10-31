import * as actionTypes from '../utils/actionTypes';

const initialState = {
  projectTitle: '',
  introMessage: '',
  outroMessage: '',
  questions: [],
};

const messages = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SETTINGS:
      return {
        ...state,
        projectTitle: action.messages.projectTitle,
        introMessage: action.messages.introMessage,
        outroMessage: action.messages.outroMessage,
        questions: action.messages.questions,
      };
    case actionTypes.CHANGE_PROJECT_TITLE:
      return {
        ...state,
        projectTitle: action.text,
      };
    case actionTypes.CHANGE_INTRO_MESSAGE:
      return {
        ...state,
        introMessage: action.text,
      };
    case actionTypes.CHANGE_OUTRO_MESSAGE:
      return {
        ...state,
        outroMessage: action.text,
      };
    case actionTypes.CHANGE_QUESTION_TEXT:
      state.questions[action.id].text = action.text;
      return {
        ...state,
        questions: [...state.questions],
      };
    case actionTypes.CHANGE_QUESTION_COLOR:
      state.questions[action.id].color = action.color;
      return {
        ...state,
        questions: [...state.questions],
      };
    case actionTypes.ADD_QUESTION:
      return {
        ...state,
        questions: [
          ...state.questions,
          {
            id: state.questions.length,
            color: getRandomColor(),
            text: 'question text',
          },
        ],
      };
    case actionTypes.DELETE_QUESTION:
      var result = state.questions.filter((item, index) => {
        if (item.id !== action.id) {
          return true;
        }
        return false;
      });

      var id = 0;
      result.map((question) => {
        question.id = id++;
      });

      return {
        ...state,
        questions: result,
      };
    default:
      return state;
  }
};

function getRandomColor() {
  var color = ((Math.random() * 0xffffff) | 0).toString(16);
  var randomColor = '#' + ('000000' + color).slice(-6);
  return randomColor;
}

export default messages;
