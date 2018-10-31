import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';

const styles = (theme) => ({
  formControl: {
    width: '100%',
  },
});

const SingleSelect = ({ label, value, options, onChange, classes }) => (
  <FormControl className={classes.formControl}>
    <InputLabel>{label}</InputLabel>
    <Select value={value} onChange={onChange}>
      {options.map((data) => (
        <MenuItem key={data.value} value={data.value}>
          {data.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default withStyles(styles)(SingleSelect);
