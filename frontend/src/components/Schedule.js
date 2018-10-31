import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import TextField from '@material-ui/core/TextField';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  textField: {
    width: 200,
  },
  errMsg: {
    width: '100%',
    textAlign: 'center',
    color: 'red',
  },
});

const Schedule = ({
  classes,
  time,
  days,
  enable,
  onEnableChange,
  onDaysButtonClick,
  onTimeChange,
  errorMessage,
}) => {
  return (
    <Grid container spacing={16}>
      <Grid container item alignItems="center" justify="space-between">
        <Grid item>
          <Typography variant="subheading">Time & Days</Typography>
        </Grid>
        <Grid item>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={enable}
                  aria-label="ScheduleSwitch"
                  onChange={() => onEnableChange(enable)}
                />
              }
              label={enable ? 'ON' : 'OFF'}
            />
          </FormGroup>
        </Grid>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={days['Mon'] === true ? 'primary' : 'default'}
          onClick={() => onDaysButtonClick('Mon')}
          disabled={!enable}
        >
          Mon
        </Button>
      </Grid>

      <Grid item>
        <Button
          variant="contained"
          color={days['Tue'] === true ? 'primary' : 'default'}
          onClick={() => onDaysButtonClick('Tue')}
          disabled={!enable}
        >
          Tue
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={days['Wed'] === true ? 'primary' : 'default'}
          onClick={() => onDaysButtonClick('Wed')}
          disabled={!enable}
        >
          Wed
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={days['Thu'] === true ? 'primary' : 'default'}
          onClick={() => onDaysButtonClick('Thu')}
          disabled={!enable}
        >
          Thu
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={days['Fri'] === true ? 'primary' : 'default'}
          onClick={() => onDaysButtonClick('Fri')}
          disabled={!enable}
        >
          Fri
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={days['Sat'] === true ? 'primary' : 'default'}
          onClick={() => onDaysButtonClick('Sat')}
          disabled={!enable}
        >
          Sat
        </Button>
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          color={days['Sun'] === true ? 'primary' : 'default'}
          onClick={() => onDaysButtonClick('Sun')}
          disabled={!enable}
        >
          Sun
        </Button>
      </Grid>
      <Grid item container style={{ marginTop: 15 }}>
        <TextField
          id="time"
          label="time"
          type="time"
          value={time}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          onChange={onTimeChange}
          onBlur={onTimeChange}
          disabled={!enable}
        />
      </Grid>
      {errorMessage !== '' ? (
        <Grid item container justify-content="center">
          <div className={classes.errMsg}>{errorMessage}</div>
        </Grid>
      ) : null}
    </Grid>
  );
};

export default withStyles(styles)(Schedule);
