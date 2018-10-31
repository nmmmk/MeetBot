import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { changeIntroMessage } from '../actions/messages';
import { requestTextValidator } from '../actions/validator';

const mapStateToProps = (state) => ({
  value: state.messages.introMessage,
  error: state.validation.introMessage.isError,
  helperText: state.validation.introMessage.message,
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (e) => {
    dispatch(changeIntroMessage(e));
    dispatch(requestTextValidator(e));
  },
  onBlur: (e) => dispatch(requestTextValidator(e)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextField);
