import NotificationSnackbar from '../components/NotificationSnackbar';
import { connect } from 'react-redux';
import { closeSnackbar } from '../actions/snackbar';

const mapStateToProps = (state) => ({
  open: state.snackbar.visible,
  message: state.snackbar.message,
  variant: state.snackbar.variant,
});

const mapDispatchToProps = (dispatch) => ({
  onClose: () => dispatch(closeSnackbar()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationSnackbar);
