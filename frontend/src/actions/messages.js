import * as actionTypes from '../utils/actionTypes';

export const changeProjectTitle = (e) => ({
  type: actionTypes.CHANGE_PROJECT_TITLE,
  text: e.target.value,
});

export const changeIntroMessage = (e) => ({
  type: actionTypes.CHANGE_INTRO_MESSAGE,
  text: e.target.value,
});

export const changeOutroMessage = (e) => ({
  type: actionTypes.CHANGE_OUTRO_MESSAGE,
  text: e.target.value,
});

export const changeQuestionColor = (id, color) => ({
  type: actionTypes.CHANGE_QUESTION_COLOR,
  color: color.hex,
  id: id,
});

export const changeQuestionText = (id, e) => ({
  type: actionTypes.CHANGE_QUESTION_TEXT,
  text: e.target.value,
  id: id,
});

export const deleteQuestion = (id) => ({
  type: actionTypes.DELETE_QUESTION,
  id: id,
});

export const addQuestion = () => ({
  type: actionTypes.ADD_QUESTION,
});
