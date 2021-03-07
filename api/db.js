const { DynamoDB } = require("aws-sdk");
const uniqid = require("uniqid");
const { add, format } = require("date-fns");
const { TABLE } = require("./constants");

const dynamoDb = new DynamoDB.DocumentClient();

function r(num) {
  return Math.floor(Math.random() * num);
}

function getRandomFutureDate() {
  const d = new Date();

  return add(d, {
    days: r(7),
    weeks: 1 + r(4),
  });
}

const saveUser = async (email, fileNames) => {
  const id = uniqid("photos-");
  const d = getRandomFutureDate();
  return dynamoDb
    .put({
      TableName: TABLE.MAIN,
      Item: {
        id,
        email,
        files: fileNames.join(","),
        developDate: parseInt(format(d, "yyyyMMdd")),
        developDateFull: d.getTime(),
        sent: false,
      },
    })
    .promise()
    .then(() => id);
};

const getPhotos = async (id) => {
  return dynamoDb
    .get({
      TableName: TABLE.MAIN,
      Key: { id },
    })
    .promise()
    .then((item) => {
      if (item.Item) {
        return item.Item;
      }

      throw new Error("No row");
    })
    .then((item) => {
      const names = item.files.split(",");
      return {
        ...item,
        urls: names.map((n) => `https://dispo-uploads.s3.amazonaws.com/${n}`),
      };
    });
};

const getTodays = async (id) => {
  const d = format(new Date(), "yyyyMMdd");

  return dynamoDb
    .scan({
      FilterExpression: "#d = :d",
      ExpressionAttributeNames: {
        "#d": "developDate",
      },
      ExpressionAttributeValues: {
        ":d": parseInt(d),
      },
      TableName: TABLE.MAIN,
    })
    .promise()
    .then((item) => {
      if (item.Items && item.Items.length) {
        return item.Items.filter((i) => !i.sent);
      }

      throw new Error("No row");
    });
};

const markItemsAsSent = async (ids) => {
  return dynamoDb
    .transactWrite({
      TransactItems: ids.map((id) => ({
        Update: {
          TableName: TABLE.MAIN,
          Key: {
            id,
          },
          UpdateExpression: "SET #v = :v",
          ExpressionAttributeNames: { "#v": "sent" },
          ExpressionAttributeValues: {
            ":v": true,
          },
        },
      })),
    })
    .promise();
};

module.exports = { saveUser, getPhotos, getTodays, markItemsAsSent };
