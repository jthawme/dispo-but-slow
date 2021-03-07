const AWS = require("aws-sdk");
const s3 = new AWS.S3({
  region: "us-east-1",
  signatureVersion: "v4",
});

const { getParam } = require("./common/utils");
const { wrap } = require("./common/wrap");
const { saveUser, getPhotos } = require("./common/db");

const ping = wrap(async (event, context, callback) => {
  return {
    statusCode: 201,
    body: {
      ping: new Date().getTime(),
      name: process.env.SERVICE_NAME,
    },
  };
});

// const token = wrap(async (event, context, callback) => {
//   const { data } = JSON.parse(event.body);

//   return {
//     statusCode: 201,
//     body: {
//       token: getToken(data),
//     },
//   };
// });

const protected = wrap(async (event, context, callback) => {
  return {
    statusCode: 201,
    body: {
      foo: "bar",
    },
  };
});

const getUploadUrls = wrap(async (event, context, callback) => {
  const { names } = JSON.parse(event.body);
  const fileNames = names.split(",");

  const urls = await Promise.all(
    fileNames.map((v) => {
      const signedUrlExpireSeconds = 60 * 5;

      return s3.getSignedUrl("putObject", {
        Bucket: process.env.BUCKET_NAME,
        Key: v,
        ContentType: "image/jpeg",
        ACL: "public-read",
        ContentDisposition: "attachment",
        Expires: signedUrlExpireSeconds,
      });
    })
  );

  return {
    statusCode: 201,
    body: {
      urls,
    },
  };
});

const save = wrap(async (event, context, callback) => {
  const { names, email } = JSON.parse(event.body);
  const fileNames = names.split(",");

  if (!names || !email) {
    throw new Error("not enough data");
  }

  const id = await saveUser(email, fileNames);

  return {
    statusCode: 201,
    body: {
      id,
    },
  };
});

const getPhotoSet = wrap(async (event, context, callback) => {
  const id = getParam(event, "id", false);

  if (!id) {
    throw new Error("No id");
  }

  const item = await getPhotos(id);

  return {
    statusCode: 201,
    body: {
      item,
    },
  };
});

module.exports = { ping, token, protected, save, getUploadUrls, getPhotoSet };
