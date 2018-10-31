import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  content: {
    display: 'flex',
    margin: theme.spacing.unit * 2,
    minWidth: '300px',
    alignItems: 'center',
  },
  message: {
    marginLeft: '30px',
  },
});

class ProgressDialog extends React.Component {
  render() {
    const { classes, message, ...other } = this.props;

    return (
      <Dialog {...other}>
        <DialogContent className={classes.content}>
          <CircularProgress size={50} />
          <DialogContentText className={classes.message}>
            {message}
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(ProgressDialog);
