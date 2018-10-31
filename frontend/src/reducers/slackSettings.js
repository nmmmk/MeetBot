import * as actionTypes from '../utils/actionTypes';

const initialState = {
  channel: {
    list: [],
    selected: '',
  },

  members: {
    list: [],
    listOfChannel: [],
    selected: [],
  },
};

const slackSettings = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_SETTINGS:
      return {
        ...state,
        channel: {
          ...state.channel,
          selected: action.slackSettings.channel,
        },
        members: {
          ...state.members,
          list: state.members.listOfChannel[action.slackSettings.channel],
          selected: action.slackSettings.members,
        },
      };
    case actionTypes.SELECT_CHANNEL:
      var members = state.members.selected;
      if (state.channel.selected !== action.value) {
        members = [];
      }

      return {
        ...state,
        channel: {
          ...state.channel,
          selected: action.value,
        },
        members: {
          ...state.members,
          list: state.members.listOfChannel[action.value],
          selected: members,
        },
      };
    case actionTypes.GET_SLACK_CHANNEL:
      return {
        ...state,
        channel: {
          ...state.channel,
          list: action.channelList,
        },
        members: {
          ...state.members,
          listOfChannel: action.userListOfChannel,
        },
      };
    case actionTypes.SELECT_PARTICIPANTS:
      return {
        ...state,
        members: {
          ...state.members,
          selected: action.value,
        },
      };
    default:
      return state;
  }
};

export default slackSettings;
