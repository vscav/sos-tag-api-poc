import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

export interface IUser extends mongoose.Document {
  _id: string;
  firstname: string;
  lastname: string;
  createdAt: string;
  updatedAt: string;
}

export type IUserModel = mongoose.Model<IUser>;

const userModel: mongoose.Schema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

userModel.plugin(autopopulate);

export default mongoose.model<IUser>('User', userModel);
