import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { requestTextValidator } from '../actions/validator';
import { changeOutroMessage } from '../actions/messages';

const mapStateToProps = (state) => ({
  value: state.messages.outroMessage,
  error: state.validation.outroMessage.isError,
  helperText: state.validation.outroMessage.message,
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (e) => {
    dispatch(changeOutroMessage(e));
    dispatch(requestTextValidator(e));
  },
  onBlur: (e) => dispatch(requestTextValidator(e)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextField);
