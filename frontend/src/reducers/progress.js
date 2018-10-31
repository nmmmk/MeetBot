import * as actionTypes from '../utils/actionTypes';

const initialState = {
  visible: false,
};

const progress = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.VISIBLE_PROGRESS:
      return {
        ...state,
        visible: action.visible,
      };
    default:
      return state;
  }
};

export default progress;
