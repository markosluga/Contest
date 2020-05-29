exports.handler = async (event) => {
// Include AWS SDK
var AWS = require('aws-sdk');
// Construct DynamoDB object with the DynamoDB Document Client
var ddb = new AWS.DynamoDB.DocumentClient({region: 'us-west-2'});
// Prepare the parameters for the DynamoDB table scan (*hardcoded to Contest) 
// We are only interested in the number of lines in the table so that the random number is maxed out at number of contestants, hence the only expression is ItemCount
var scanparams = {
  TableName: 'Contest',
  ProjectionExpression: 'ItemCount'
};
// Run the scan
var scandata = await ddb.scan(scanparams).promise();
// set the maxnum variable to the ScannedCount result for the table scan
var maxnum = scandata.ScannedCount;
// set the num value to be a random number with an upper limit of maxnum 
var num = Math.floor(Math.random()*maxnum).toString();
// Prepare the parameters to pick the winner from the random number and project UserName
var params = {
  TableName: 'Contest',
  Key: {
    'uuid': num
  },
  ProjectionExpression: 'UserName'
};
// Run the query to get the item
var picker = await ddb.get(params).promise();
// Filter the picker output to only get the username
var winner = picker.Item.UserName;
// Respond with the number of contestants (rows scanned) and the winner
const response = {
"Number of contestants is": maxnum,
"Winner is": winner,
};
return response;
};
