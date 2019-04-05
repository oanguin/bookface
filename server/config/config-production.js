module.exports = {
  port: process.env.PORT || 3000,
  ip: 'https://bookfaceappdsdsd.herokuapp.com/',
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
    user: "apikey",
    password: "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",
    host: "smtp.sendgrid.net",
    port: 587
  },
  database: "mongodb://bookface:bookfacepassword@bookface-shard-00-00-laxnl.gcp.mongodb.net:27017,bookface-shard-00-01-laxnl.gcp.mongodb.net:27017,bookface-shard-00-02-laxnl.gcp.mongodb.net:27017/bookfacedb?ssl=true&replicaSet=BookFace-shard-0&authSource=admin&retryWrites=true"
};