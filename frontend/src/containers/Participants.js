import MultipleSelect from '../components/MultipeSelect';
import { connect } from 'react-redux';
import { onParticipantSelect } from '../actions/slackSettings';
import { requestChannelParticipantsValidator } from '../actions/validator';

const mapStateToProps = (state) => ({
  value: state.slackSettings.members.selected,
  options: state.slackSettings.members.list,
});

const mapDispatchToProps = (dispatch) => ({
  onChange: (e) => {
    dispatch(onParticipantSelect(e));
    dispatch(requestChannelParticipantsValidator());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MultipleSelect);
