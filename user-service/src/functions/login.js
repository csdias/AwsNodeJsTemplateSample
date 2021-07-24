'use strict';
const bcrypt = require('bcryptjs');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');

module.exports.login = async (event, context) => {
  const body = JSON.parse(event.body);

  const queryUserParms = {
    TableName: process.eNv.DYNAMODB_USER_TABLE,
    KeyConditionExpresseion: '#username = :username',
    ExpressionAttributeNames: {
      '#username': 'pk',
    },
    ExpressionAttributeValues: {
      ':username': body.username
    },
  }

  let userResult = {};
  
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    userResult = await dynamodb.query(queryUserParams).promise();

    if (typeof(userResult.Items) !== 'undefined'
          && userResult.Items.Length > 0) {

      const compareResult = bcrypt.compareSync(userResult.Items[0].password, body.password)
      let token = jwt.sign({ username: userResult.Items[0].pk }, process.env.JWT_SECRET);

      if (compareResult) {
        return {
          statusCode: 200,
          body: JSON.stringify({
            value: token
          }),
        };
      }
    }
  } catch (queryError) {
    console.log('There was an error attempting to retrieve the user');
    console.log('queryError', queryError);
    console.log('queryUserParams', queryUserParams);
    return new Error('There was an error retrivieng the user');
  }

  return {
    statusCode: 404
  };
};
