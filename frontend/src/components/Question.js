import React from 'react';
import TextField from '@material-ui/core/TextField';
import IconButton from '@material-ui/core/IconButton';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import DeleteIcon from '@material-ui/icons/Delete';
import Grid from '@material-ui/core/Grid';
import { SketchPicker } from 'react-color';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  popover: {
    position: 'absolute',
    zIndex: '2',
  },
  cover: {
    position: 'fixed',
    top: '0px',
    right: '0px',
    bottom: '0px',
    left: '0px',
  },
});

class Question extends React.Component {
  state = {
    displayColorPicker: false,
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
  };

  handleClose = () => {
    this.setState({ displayColorPicker: false });
  };

  handleChange = (color) => {
    this.setState({ color: color.hex });
  };

  render() {
    const {
      id,
      text,
      color,
      onColorChange,
      onTextChange,
      onDeleteItem,
    } = this.props;
    return (
      <Grid container>
        <Grid container item justify="space-between" alignItems="center">
          <Grid
            item
            style={{
              flex: 1,
            }}
          >
            <Grid
              item
              container
              alignItems="center"
              spacing={8}
              style={{ flexWrap: 'nowrap' }}
            >
              <Grid item>
                <svg width="6" height="34">
                  <rect width="100%" height="100%" x="0" y="0" fill={color} />
                </svg>
              </Grid>
              <Grid item style={{ flex: 1 }}>
                <TextField
                  value={text}
                  onChange={(e) => onTextChange(id, e)}
                  style={{ width: '100%' }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <IconButton aria-label="ChangeColor" onClick={this.handleClick}>
              <FormatColorFillIcon />
            </IconButton>
            <IconButton aria-label="Delete" onClick={() => onDeleteItem(id)}>
              <DeleteIcon />
            </IconButton>
            {this.state.displayColorPicker ? (
              <div className={this.props.classes.popover}>
                <div
                  className={this.props.classes.cover}
                  onClick={this.handleClose}
                />
                <SketchPicker
                  color={color}
                  onChange={(e) => onColorChange(id, e)}
                />
              </div>
            ) : null}
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Question);
