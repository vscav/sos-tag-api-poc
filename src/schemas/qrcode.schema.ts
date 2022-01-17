import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType({ description: 'QR Code Schema' })
class QRCode {
  @Field(() => ID)
  _id: String;

  @Field(() => Boolean, { defaultValue: false })
  inUse: boolean;

  @Field(() => String)
  createdAt: Date;

  @Field(() => String)
  updatedAt: Date;
}

export default QRCode;
