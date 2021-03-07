const AWS = require("aws-sdk");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SEND_GRID_KEY);
const s3 = new AWS.S3({
  region: "us-east-1",
  signatureVersion: "v4",
});

const { getParam } = require("./utils");
const { wrap } = require("./wrap");
const { saveUser, getPhotos, getTodays, markItemsAsSent } = require("./db");

const ping = wrap(async (event, context, callback) => {
  return {
    statusCode: 200,
    body: {
      ping: new Date().getTime(),
      name: process.env.SERVICE_NAME,
    },
  };
});

// const token = wrap(async (event, context, callback) => {
//   const { data } = JSON.parse(event.body);

//   return {
//     statusCode: 200,
//     body: {
//       token: getToken(data),
//     },
//   };
// });

const protected = wrap(async (event, context, callback) => {
  return {
    statusCode: 200,
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
    statusCode: 200,
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
    statusCode: 200,
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
    statusCode: 200,
    body: {
      item,
    },
  };
});

const sendEmails = wrap(async (event, context, callback) => {
  const items = await getTodays();

  const ids = await Promise.all(
    items.map((item) => {
      const msg = {
        to: item.email,
        from: "hi@jthaw.me", // Use the email address or domain you verified above
        subject: "📷 Your photos are ready",
        text: `View them and download them here http://dispo.jthaw.club/photos?receipt=${item.id}. \n\n Thanks for your patience, it took a long time`,
        html: `View them and download them <a href="http://dispo.jthaw.club/photos?receipt=${item.id}">here</a><br/><br/>Thanks for your patience, it took a long time`,
      };

      return sgMail.send(msg).then(() => item.id);
    })
  ).catch((e) => {
    console.error(e);
    console.error(e.response.body.errors);
    throw new Error("sendgrid issue");
  });

  if (ids.length) {
    await markItemsAsSent(ids);
  }

  return {
    statusCode: 200,
    body: {
      send: ids.length,
    },
  };
});

module.exports = {
  ping,
  protected,
  save,
  getUploadUrls,
  getPhotoSet,
  sendEmails,
};
