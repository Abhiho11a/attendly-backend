require("dotenv").config();

const app = require("./app");
const connectDatabase = require("./config/database");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `Attendly backend running on port ${PORT}`
    );
  });
};

startServer();