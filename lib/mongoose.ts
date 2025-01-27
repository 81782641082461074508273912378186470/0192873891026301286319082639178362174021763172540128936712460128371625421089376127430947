import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable');
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Mongoose | null;
    promise: Promise<mongoose.Mongoose> | null;
  };
}

global.mongoose = global.mongoose || { conn: null, promise: null };

async function mongooseConnect() {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    global.mongoose.promise = mongoose
      .connect(MONGO_URI, { bufferCommands: false,dbName: 'autolaku'  })
      .then((mongooseInstance) => mongooseInstance);
  }

  global.mongoose.conn = await global.mongoose.promise;
  //console.log('Connected to MongoDB');
  return global.mongoose.conn;
}

export default mongooseConnect;
