process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'reflect-metadata';

import { __prod__ } from '@constants/env';
import AccountResolver from '@resolvers/account.resolver';
import AuthResolver from '@resolvers/auth.resolver';
import UserResolver from '@resolvers/user.resolver';
import { logger, stream } from '@utils/logger';
import { ApolloServer, ExpressContext } from 'apollo-server-express';
import compression from 'compression';
import config from 'config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv-safe/config';
import express from 'express';
import { GraphQLSchema } from 'graphql';
import helmet from 'helmet';
import hpp from 'hpp';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import { connect, ConnectOptions, set } from 'mongoose';
import morgan from 'morgan';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import { refreshToken } from '@utils/token';
import dbConnection from '@databases';
import Context from '@interfaces/context.interface';

class Server {
  public express: express.Application;
  public apollo: ApolloServer<ExpressContext>;
  public port: string | number;
  public env: string;
  public schema: GraphQLSchema;

  constructor() {
    this.express = express();

    this.port = process.env.PORT || 8080;
    this.env = process.env.NODE_ENV || 'development';

    this.initialize();
  }

  private async initialize() {
    this.express.set('proxy', 1);

    await this.buildGraphQLSchema();
    await this.connectToDatabase();
    this.initializeTranslation();
    this.initializeMiddlewares();
    this.initializeRoutes();
    await this.initializeApolloServer();
  }

  private async buildGraphQLSchema() {
    this.schema = await buildSchema({
      resolvers: [AccountResolver, AuthResolver, UserResolver],
      emitSchemaFile: true,
      nullableByDefault: true,
      container: Container,
    });
  }

  private async connectToDatabase() {
    if (!__prod__) {
      set('debug', true);
    }

    try {
      await connect(dbConnection.url, dbConnection.options as ConnectOptions);
    } catch (error) {
      logger.error(`[mongoose:connect] ${error.message}.`);
      throw error;
    }
    logger.info('[mongoose:connect] The connection with the database has been established successfully.');
  }

  public get() {
    return this.express;
  }

  private async initializeApolloServer() {
    this.apollo = new ApolloServer({
      schema: this.schema,
      context: ({ req, res }) => ({ req, res } as Context),
    });

    await this.apollo.start();

    this.apollo.applyMiddleware({ app: this.express, cors: false });
  }

  private initializeMiddlewares() {
    __prod__ && this.express.use(morgan(config.get('log.format'), { stream }));
    this.express.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));
    this.express.use(cookieParser());
    this.express.use(hpp());
    this.express.use(helmet({ contentSecurityPolicy: __prod__ ? undefined : false }));
    this.express.use(compression());
    this.express.use(middleware.handle(i18next));
  }

  private initializeRoutes() {
    this.express.get('/', (_, res) => res.send(`SOS-Tag API (alpha version)`));
    this.express.post('/refresh_token', (req, res) => refreshToken(req, res));
  }

  private initializeTranslation() {
    i18next
      .use(Backend)
      .use(middleware.LanguageDetector)
      .init({
        fallbackLng: 'en',
        backend: {
          loadPath: `${__dirname}/locales/{{lng}}/translation.json`,
        },
      });
  }

  public listen() {
    this.express.listen(typeof this.port === 'string' ? parseInt(this.port) : this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} ========`);
      logger.info(`  App listening on port ${this.port}  `);
      logger.info(`=================================`);
    });
  }
}

export default Server;
