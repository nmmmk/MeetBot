import axios from 'axios';

var token = process.env.REACT_APP_SLACK_TOKEN;
var baseUrl = 'https://slack.com/api/';

export function getChannelList() {
  // チャンネル一覧取得
  const promise = axios
    .get(baseUrl + 'channels.list', {
      params: {
        token: token,
      },
    })
    .then((response) => ({ response }))
    .catch((error) => ({ error }));

  return promise;
}

export function getUserList() {
  // ユーザー一覧取得
  const promise = axios
    .get(baseUrl + 'users.list', {
      params: {
        token: token,
      },
    })
    .then((response) => ({ response }))
    .catch((error) => ({ error }));

  return promise;
}

export function getGroupList() {
  // ユーザー一覧取得
  const promise = axios
    .get(baseUrl + 'groups.list', {
      params: {
        token: token,
      },
    })
    .then((response) => ({ response }))
    .catch((error) => ({ error }));

  return promise;
}

export function getConversationsOpen(user) {
  // DM用のIDは、conversations.openのusersに各ユーザーのidを指定すると、dm_id相当のidを返してくれる
  const promise = axios
    .get(baseUrl + 'conversations.open', {
      params: {
        token: token,
        users: user,
      },
    })
    .then((response) => ({ response }))
    .catch((error) => ({ error }));

  return promise;
}

export function getUserListOfChannel(channels, groups, users) {
  var usersOfChannel = {};
  var userAll = {};

  // ユーザー一覧
  users.data.members.forEach((user) => {
    if (!user.is_bot) {
      userAll[user.id] = user.profile.display_name;
    }
  });

  // チャンネル毎のユーザー一覧(Public)
  channels.data.channels.forEach((channel) => {
    var members = [];
    channel.members.forEach((member) => {
      if (member in userAll) {
        members.push({ value: member, label: userAll[member] });
      }
    });

    usersOfChannel[channel.id] = members;
  });

  // チャンネル毎のユーザー一覧(Private)
  groups.data.groups.forEach((channel) => {
    var members = [];
    channel.members.forEach((member) => {
      if (member in userAll) {
        members.push({ value: member, label: userAll[member] });
      }
    });

    usersOfChannel[channel.id] = members;
  });

  return usersOfChannel;
}
