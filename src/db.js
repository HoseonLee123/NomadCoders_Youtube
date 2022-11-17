import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL);

mongoose.connection.on("error", (error) => console.log("DB Eroor ❌", error));
mongoose.connection.once("open", () => console.log("Connected to DB ✅"));
