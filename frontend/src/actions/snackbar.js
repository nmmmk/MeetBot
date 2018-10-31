import * as actionTypes from '../utils/actionTypes';

export const openSnackbar = (variant, message) => ({
  type: actionTypes.OPEN_SNACKBAR,
  variant: variant,
  message: message,
});

export const closeSnackbar = () => ({
  type: actionTypes.CLOSE_SNACKBAR,
});
