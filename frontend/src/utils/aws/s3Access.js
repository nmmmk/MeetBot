import AWS from 'aws-sdk';

export default class S3Access {
  constructor() {
    AWS.config.update({
      region: process.env.REACT_APP_AWS_REGION,
      accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
    });

    this.s3 = new AWS.S3();
  }

  upload(fileName, body) {
    var param = {
      Bucket: 'meetbot',
      Key: fileName,
      Body: body,
      ContentType: 'text/json',
    };

    var req = this.s3.putObject(param);
    var promise = req
      .promise()
      .then((response) => ({ response }))
      .catch((error) => ({ error }));

    return promise;
  }

  download(fileName) {
    var param = {
      Bucket: 'meetbot',
      Key: fileName,
    };

    var req = this.s3.getObject(param);
    var promise = req
      .promise()
      .then((response) => ({ response }))
      .catch((error) => ({ error }));

    return promise;
  }
}
