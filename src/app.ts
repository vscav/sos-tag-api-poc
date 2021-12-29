process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import Server from '@/server';
import AccountModel from '@models/account.model';
import UserModel from '@models/user.model';
import validateEnv from '@utils/validate-env';
import 'dotenv/config';
import { Container } from 'typedi';

validateEnv();

Container.set({ id: 'ACCOUNT', factory: () => AccountModel });
Container.set({ id: 'USER', factory: () => UserModel });

const server = new Server();

server.listen();
