module.exports = {
  port: 3000,
  ip: "0.0.0.0",
  secret: "secret should be read for environment variable",
  authUrlExceptions: [".jpg",
    ".gif",
    ".html",
    ".css",
    ".js",
    ".map",
    ".ttf",
    ".ttf?srf3rx"
  ],
  email: {
    user: "znwktha4cnujtvzd@ethereal.email",
    password: "NtGgfwcGGp6gacRf7D",
    host: "smtp.ethereal.email",
    port: 587
  },
  database: "mongodb://bookface:bookfacepassword@bookface-shard-00-00-laxnl.gcp.mongodb.net:27017,bookface-shard-00-01-laxnl.gcp.mongodb.net:27017,bookface-shard-00-02-laxnl.gcp.mongodb.net:27017/bookfacedb?ssl=true&replicaSet=BookFace-shard-0&authSource=admin&retryWrites=true"
};