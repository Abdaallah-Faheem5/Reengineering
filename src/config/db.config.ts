import mongoose = require("mongoose");
import { DB_CONNECTION } from './env.config';
const connectDB = async () => {
  try {

    // @ts-expect-error TS(2345): Argument of type 'string | undefined' is not assig... Remove this comment to see the full error message
    await mongoose.connect(DB_CONNECTION);

    console.log(`Connected to MongoDB`);
  } catch (error) {
    console.error("Failed to connect to MongoDB");
    console.error((error as any).message);
    process.exit(1);
  }
};

export = connectDB;
