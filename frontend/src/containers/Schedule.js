import Schedule from '../components/Schedule';
import { connect } from 'react-redux';
import { changeDay, changeSchedule, changeTime } from '../actions/schedule';
import { requestScheduleValidator } from '../actions/validator';

const mapStateToProps = (state) => ({
  days: state.schedule.days,
  time: state.schedule.time,
  enable: state.schedule.enable,
  errorMessage: state.validation.schedule.message,
});

const mapDispatchToProps = (dispatch) => ({
  onDaysButtonClick: (day) => {
    dispatch(changeDay(day));
    dispatch(requestScheduleValidator());
  },
  onEnableChange: (enable) => {
    dispatch(changeSchedule(enable));
    dispatch(requestScheduleValidator());
  },
  onTimeChange: (time) => {
    dispatch(changeTime(time));
    dispatch(requestScheduleValidator());
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Schedule);
