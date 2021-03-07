// const getToken = (method = "general") => {
//   return jwt.sign(
//     {
//       method,
//     },
//     process.env.JWT_SECRET
//   );
// };

// const verifyToken = (token, method = "general") => {
//   try {
//     if (!token) {
//       throw new Error("Nope");
//     }

//     var decoded = jwt.verify(token, process.env.JWT_SECRET);

//     return decoded === method;
//   } catch (err) {
//     throw new Error("Invalid token");
//   }
// };

const getParam = (event, key, defaultValue) => {
  if (!event.queryStringParameters || !event.queryStringParameters[key]) {
    return defaultValue;
  }

  return event.queryStringParameters[key];
};

module.exports = { getParam };
