process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import 'dotenv/config';
import AccountModel from '@models/account.model';
import UserModel from '@models/user.model';
import validateEnv from '@utils/validate-env';
import { Container } from 'typedi';
import Server from '@/server';

validateEnv();

Container.set({ id: 'ACCOUNT', factory: () => AccountModel });
Container.set({ id: 'USER', factory: () => UserModel });

const server = new Server();

server.listen();
