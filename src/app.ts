process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'reflect-metadata';

import dbConnection from './databases';
import Context from '@interfaces/context.interface';
import AccountModel from '@models/account.model';
import AccountResolver from '@resolvers/account.resolver';
import UserResolver from '@resolvers/user.resolver';
import AuthResolver from '@resolvers/auth.resolver';
import { logger, stream } from '@utils/logger';
import validateEnv from '@utils/validate-env';
import { ApolloServer } from 'apollo-server-express';
import compression from 'compression';
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv-safe/config';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import { connect, ConnectOptions, set } from 'mongoose';
import morgan from 'morgan';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { refreshToken } from 'utils/token';
import UserModel from '@models/user.model';
import { __prod__ } from '@constants/env';

Container.set({ id: 'ACCOUNT', factory: () => AccountModel });
Container.set({ id: 'USER', factory: () => UserModel });

validateEnv();

const start = async () => {
  const port = process.env.PORT || 8080;
  const env = process.env.NODE_ENV || 'development';

  // Build graphql schema (and pass the container data models to use in services)
  const schema = await buildSchema({
    resolvers: [AccountResolver, AuthResolver, UserResolver],
    emitSchemaFile: true,
    nullableByDefault: true,
    container: Container,
  });

  // Create a new express application
  const app = express();

  // If we are not in production mode, we able debug mode on mongoose
  if (env !== 'production') {
    set('debug', true);
  }

  // Try to connect to the MongoDB database
  try {
    await connect(dbConnection.url, dbConnection.options as ConnectOptions);
  } catch (error) {
    logger.error(`[mongoose:connect] ${error.message}.`);
    throw error;
  }
  logger.info('[mongoose:connect] The connection with the database has been established successfully.');

  app.set('proxy', 1);

  // Apply middlewares
  __prod__ && app.use(morgan(config.get('log.format'), { stream }));
  app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));
  app.use(cookieParser());
  app.use(hpp());
  app.use(helmet({ contentSecurityPolicy: __prod__ ? undefined : false }));
  // app.use(helmet({ contentSecurityPolicy: __prod__ ? false : false }));
  app.use(compression());

  // Define routes
  // Helper text in development
  env === 'development' &&
    app.get('/', (_, res) => res.send(`Go to http://localhost:${port}/graphql to test SOS-Tag api requests in apollo playground`));
  // Create a route only dedicated to handle the refresh tokens
  app.post('/refresh_token', (req, res) => refreshToken(req, res));

  // Create an Apollo server (give context the express request and response)
  const server = new ApolloServer({
    schema,
    context: ({ req, res }) => ({ req, res } as Context),
  });

  await server.start();

  server.applyMiddleware({ app, cors: false });

  app.listen(typeof port === 'string' ? parseInt(port) : port, () => {
    logger.info(`=================================`);
    logger.info(`======= ENV: ${env} ========`);
    logger.info(`  App listening on port ${port}  `);
    logger.info(`=================================`);
  });
};

start();
