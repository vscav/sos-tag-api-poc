import { PaginatorInput } from '@dtos/common.dto';
import { IQRCode, IQRCodeModel } from '@models/qrcode.model';
import { PaginatedQRCodeResponse, QRCodeResponse, QRCodesResponse } from '@responses/qrcode.response';
import { transformQRCode } from '@services/utils/transform';
import { customAlphabet } from 'nanoid';
import { Inject, Service } from 'typedi';

const customNanoId = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ1234578', 8);

@Service()
class UserService {
  constructor(@Inject('QRCODE') private readonly qrCodes: IQRCodeModel) {}

  async createQRCode(): Promise<QRCodeResponse> {
    const qrCode = await this.qrCodes.create({
      _id: customNanoId(),
    });
    return { response: transformQRCode(await qrCode.save()) };
  }

  async getQRCodes(): Promise<QRCodesResponse> {
    const qrCodes: IQRCode[] = await this.qrCodes.find();
    return { response: qrCodes.map(qrCode => transformQRCode(qrCode)) };
  }

  async getQRCodesWithPagination({ page, limit }: PaginatorInput): Promise<PaginatedQRCodeResponse> {
    const qrCodes = await this.qrCodes
      .find()
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await this.qrCodes.countDocuments();
    const totalPages = Math.ceil(count / limit);
    const currentPage = page;
    const hasMore = page < totalPages;

    return {
      items: qrCodes,
      totalPages,
      currentPage,
      hasMore,
    };
  }
}

export default UserService;
