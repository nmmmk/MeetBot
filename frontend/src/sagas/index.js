import { fork, all } from 'redux-saga/effects';
import { requestLoadSettings } from './load';
import { requestApplySettings } from './update';
import {
  requestTextValidating,
  requestQuestionsValidating,
  requireScheduleValidating,
  requireChannelParticiantsValidating,
} from './validator';

export default function* rootSaga() {
  yield all([
    fork(requestLoadSettings),
    fork(requestApplySettings),
    fork(requestTextValidating),
    fork(requestQuestionsValidating),
    fork(requireScheduleValidating),
    fork(requireChannelParticiantsValidating),
  ]);
}
