import mongoose from "mongoose";

export function mongoSetup(url: string): void {
    mongoose.connect(url, {
      useFindAndModify: false,
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    const db = mongoose.connection;
    db.on("error", console.error.bind(console, "connection error:"));
    db.once("open", function () {
      console.log("Connect successfully");
    });
  }

