import QuestionList from '../components/QuestionList';
import { connect } from 'react-redux';
import {
  changeQuestionColor,
  changeQuestionText,
  deleteQuestion,
  addQuestion,
} from '../actions/messages';
import { requestQuestionsValidator } from '../actions/validator';

const mapStateToProps = (state, ownProps) => ({
  questions: state.messages.questions,
  errorMessage: state.validation.questions.message,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onTextChange: (id, text) => {
    dispatch(changeQuestionText(id, text));
    dispatch(requestQuestionsValidator());
  },
  onColorChange: (id, color) => {
    dispatch(changeQuestionColor(id, color));
    dispatch(requestQuestionsValidator());
  },
  onDeleteItem: (id) => {
    dispatch(deleteQuestion(id));
    dispatch(requestQuestionsValidator());
  },
  onAddItem: () => {
    dispatch(addQuestion());
    dispatch(requestQuestionsValidator());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(QuestionList);
