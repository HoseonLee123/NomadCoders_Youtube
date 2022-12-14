// App start setting
import "dotenv/config";
import "./db"; // Connect to a mongoDB
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;
app.listen(PORT, () =>
  console.log(`Server listening on port http://localhost:${PORT} ✅`)
); // The server is listening
