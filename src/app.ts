process.env['NODE_CONFIG_DIR'] = __dirname + '/configs';

import Server from '@/server';
import QRCodeModel from '@models/qrcode.model';
import UserModel from '@models/user.model';
import validateEnv from '@utils/validate-env';
import 'dotenv/config';
import { Container } from 'typedi';

validateEnv();

Container.set({ id: 'USER', factory: () => UserModel });
Container.set({ id: 'QRCODE', factory: () => QRCodeModel });

const server = new Server();

server.listen();
