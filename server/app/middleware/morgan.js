const morgan = require("morgan");
const jwt = require("jsonwebtoken");
const db = require("../models"); // Call Models Table
const Log = db.log; // Model User
const config = require("../config/auth.config.js");

const stream = {
  write: async (message) => {
    const data = message.split(" ", 6);
    const user = JSON.parse(message.split(" ")[6]);
    let day = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    let month = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    let timestamp = `${day[new Date().getDay()]}, ${new Date().getDate()} ${
      month[new Date().getMonth()]
    } ${new Date().getFullYear()}`;

    try {
      await Log.create({
        userId: user.length > 0 ? user[0] : null,
        username: user.length > 0 ? user[1] : "-",
        client_ip: data[0],
        request_method: data[1],
        endpoint: data[2],
        status_code: data[3],
        content_length: data[4],
        response_time: data[5],
        date: timestamp,
      });
    } catch (error) {
      console.log(error.message);
    }
  },
};

// const skip = () => {
//     const env = process.env.NODE_ENV || 'development';
//     return env !== "development";
// };

morgan.token("user", (req, res) => {
  const token = req.headers["x-access-token"];
  const user = [];
  if (token) {
    jwt.verify(token, config.secret, (err, decoded) => {
      user.push(
        decoded ? decoded.id : "Anonymous",
        decoded ? decoded.username : "Anonymous"
      );
    });
  }
  return JSON.stringify(user);
});

const morganMiddleware = morgan(
  ":remote-addr :method :url :status :res[content-length] :response-time :user",
  { stream }
);

module.exports = morganMiddleware;
