import * as actionTypes from '../utils/actionTypes';

const initialState = {
  visible: false,
  message: '',
  variant: '',
};

const snackbar = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.OPEN_SNACKBAR:
      return {
        ...state,
        visible: true,
        message: action.message,
        variant: action.variant,
      };
    case actionTypes.CLOSE_SNACKBAR:
      return {
        ...state,
        visible: false,
      };

    default:
      return state;
  }
};

export default snackbar;
