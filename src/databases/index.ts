import 'dotenv/config';
import dbConfig from '@interfaces/db.interface';
import config from 'config';

const { user, database }: dbConfig = config.get('dbConfig');

const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const dbConnection = {
  url: `mongodb+srv://${user}:${process.env.DB_PASSWORD}@cluster0.y7t9g.mongodb.net/${database}?retryWrites=true&w=majority`,
  options: mongooseOptions,
};

export default dbConnection;
