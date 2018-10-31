import AWS from 'aws-sdk';

export default class CloudWatchEvents {
  constructor() {
    AWS.config.update({
      region: process.env.REACT_APP_AWS_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    this.cloudwatchevents = new AWS.CloudWatchEvents();
  }

  getRule() {
    var params = {
      Limit: 1,
      NamePrefix: 'start_meetbot_schedule',
    };
    var req = this.cloudwatchevents.listRules(params);
    var promise = req
      .promise()
      .then((response) => ({ response }))
      .catch((error) => ({ error }));

    return promise;
  }

  putRule(enable, expression) {
    const state = enable === true ? 'ENABLED' : 'DISABLED';

    var params = {
      Name: 'start_meetbot_schedule',
      ScheduleExpression: expression,
      State: state,
    };

    var req = this.cloudwatchevents.putRule(params);
    var promise = req
      .promise()
      .then((response) => ({ response }))
      .catch((error) => ({ error }));

    return promise;
  }
}
