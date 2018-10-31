import SingleSelect from '../components/SingleSelect';
import { connect } from 'react-redux';
import { onChannelSelect } from '../actions/slackSettings';

const mapStateToProps = (state) => ({
  value: state.slackSettings.channel.selected,
  options: state.slackSettings.channel.list,
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (e) => dispatch(onChannelSelect(e)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleSelect);
