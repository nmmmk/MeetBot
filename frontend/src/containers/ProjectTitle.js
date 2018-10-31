import TextField from '@material-ui/core/TextField';
import { connect } from 'react-redux';
import { requestTextValidator } from '../actions/validator';
import { changeProjectTitle } from '../actions/messages';

const mapStateToProps = (state) => ({
  value: state.messages.projectTitle,
  error: state.validation.projectTitle.isError,
  helperText: state.validation.projectTitle.message,
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (e) => {
    dispatch(changeProjectTitle(e));
    dispatch(requestTextValidator(e));
  },
  onBlur: (e) => dispatch(requestTextValidator(e)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextField);
