import * as actionTypes from '../utils/actionTypes';

export const onChannelSelect = (e) => ({
  type: actionTypes.SELECT_CHANNEL,
  value: e.target.value,
});

export const onParticipantSelect = (e) => ({
  type: actionTypes.SELECT_PARTICIPANTS,
  value: e,
});

export const getSlackInfo = (channelList, userListOfChannel) => ({
  type: actionTypes.GET_SLACK_CHANNEL,
  channelList: channelList,
  userListOfChannel: userListOfChannel,
});
