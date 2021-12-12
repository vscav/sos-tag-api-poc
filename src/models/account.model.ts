import { IUser } from '@models/user.model';
import mongoose, { Schema } from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

export interface IAccount extends mongoose.Document {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  password: string;
  users: IUser[];
  confirmed: boolean;
  tokenVersion: number;
  createdAt: string;
  updatedAt: string;
}

export type IAccountModel = mongoose.Model<IAccount>;

const accountModel: mongoose.Schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        autopopulate: { maxDepth: 2 },
      },
    ],
    confirmed: {
      type: Boolean,
    },
    tokenVersion: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  { timestamps: true },
);

accountModel.plugin(autopopulate);

export default mongoose.model<IAccount>('Account', accountModel);
