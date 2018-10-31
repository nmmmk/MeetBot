import * as actionTypes from '../utils/actionTypes';

export const showProgress = (visible) => ({
  type: actionTypes.VISIBLE_PROGRESS,
  visible: visible,
});
