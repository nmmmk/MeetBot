import React, { Component } from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import BroadcastChannel from './containers/BroadcastChannel';
import Participants from './containers/Participants';
import NotificationSnackbar from './containers/NotificationSnackbar';
import Header from './components/Header';
import Schedule from './containers/Schedule';
import QuestionList from './containers/QuestionList';
import ProjectTitle from './containers/ProjectTitle';
import IntroMessage from './containers/IntroMessage';
import OutroMessage from './containers/OutroMessage';
import ProgressDialog from './components/ProgressDialog';
import Button from '@material-ui/core/Button';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withStyles } from '@material-ui/core/styles';
import * as progress from './actions/progress';
import * as setActions from './actions/settings';
import * as validator from './actions/validator';

const styles = (theme) => ({
  itemGroup: {
    backgroundColor: '#eeeeee',
    padding: '30px',
    borderRadius: '5px',
  },
  errMsg: {
    width: '100%',
    textAlign: 'center',
    color: 'red',
  },
});

class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { setActions } = this.props;
    setActions.requestLoadSettings();
  }

  render() {
    const { setActions, classes, settings } = this.props;
    return (
      <div style={{ backgroundColor: '#fafafa' }}>
        <ProgressDialog
          open={settings.progress.visible}
          message="Please wait..."
        />
        <NotificationSnackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          autoHideDuration={6000}
        />

        <Grid container justify="center">
          <Grid item container>
            <Header title="MeetBot" />
          </Grid>
          <Grid
            item
            container
            xs={12}
            sm={10}
            md={6}
            spacing={40}
            justify="center"
            style={{ marginTop: 20 }}
          >
            {/* Project title */}
            <Grid item container>
              <ProjectTitle
                name="projectTitle"
                label="Project title"
                style={{ width: '100%' }}
                InputLabelProps={{ style: { fontSize: '24px' } }}
                inputProps={{ style: { fontSize: '24px' } }}
              />
            </Grid>
            {/* Broadcast channel & Participants */}
            <Grid item container>
              <Grid item container>
                <Typography variant="headline">
                  Broadcast channel & Participants
                </Typography>
              </Grid>

              <Grid item container className={classes.itemGroup}>
                <Grid item container spacing={32} direction="column">
                  <Grid item>
                    <BroadcastChannel label="Broadcast channel" />
                  </Grid>
                  <Grid item>
                    <Participants placeholder="Participants" />
                  </Grid>
                  {settings.validation.channelParticipants.message !== '' ? (
                    <Grid item container justify-content="center">
                      <div className={classes.errMsg}>
                        {settings.validation.channelParticipants.message}
                      </div>
                    </Grid>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>

            {/* Schedule */}
            <Grid item container>
              <Grid item container>
                <Typography variant="headline">Schedule</Typography>
              </Grid>

              <Grid item container className={classes.itemGroup}>
                <Schedule />
              </Grid>
            </Grid>
            {/* Intro message */}
            <Grid item container>
              <Grid item container>
                <Typography variant="headline">Intro message</Typography>
              </Grid>
              <Grid item container className={classes.itemGroup}>
                <IntroMessage
                  name="introMessage"
                  label="message"
                  style={{ width: '100%' }}
                />
              </Grid>
            </Grid>

            {/* Questions */}
            <Grid item container>
              <Grid item container>
                <Typography variant="headline">Questions</Typography>
              </Grid>
              <Grid item container className={classes.itemGroup}>
                <QuestionList />
              </Grid>
            </Grid>

            {/* Outro message */}
            <Grid item container>
              <Grid item container>
                <Typography variant="headline">Outro message</Typography>
              </Grid>
              <Grid item container className={classes.itemGroup}>
                <OutroMessage
                  name="outroMessage"
                  label="message"
                  style={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Apply Button */}
          <Grid
            item
            container
            style={{ marginTop: 30, marginBottom: 30 }}
            spacing={16}
            justify="center"
          >
            <Button
              variant="contained"
              color="primary"
              style={{ minWidth: 100 }}
              onClick={() => setActions.requestApplySettings()}
            >
              Apply
            </Button>
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapState = (state) => ({
  settings: state,
});

function mapDispatch(dispatch) {
  return {
    setActions: bindActionCreators(setActions, dispatch),
    progress: bindActionCreators(progress, dispatch),
    validator: bindActionCreators(validator, dispatch),
  };
}

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(App));
