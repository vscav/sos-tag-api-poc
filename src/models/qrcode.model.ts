import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

export interface IQRCode extends mongoose.Document {
  _id: string;
  inUse: string;
}

export type IQRCodeModel = mongoose.Model<IQRCode>;

const qrcodeModel: mongoose.Schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    inUse: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  {
    _id: false,
    timestamps: true,
  },
);

qrcodeModel.plugin(autopopulate);

export default mongoose.model<IQRCode>('QRCode', qrcodeModel);
