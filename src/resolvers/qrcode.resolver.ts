import { PaginatorInput } from '@dtos/common.dto';
import { isAuth } from '@middlewares/is-auth.middleware';
import { PaginatedQRCodeResponse, QRCodeResponse, QRCodesResponse } from '@responses/qrcode.response';
import QRCodeSchema from '@schemas/qrcode.schema';
import QRCodeService from '@services/qrcode.service';
import { logger } from '@utils/logger';
import { Arg, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { Service } from 'typedi';

@Service()
@Resolver(() => QRCodeSchema)
class QRCodeResolver {
  constructor(private readonly qrCodeService: QRCodeService) {}

  @Mutation(() => QRCodeResponse, { description: 'Create a QR Code with a custom id. By default, the QR Code is not used.' })
  async createQRCode(): Promise<QRCodeResponse> {
    try {
      const createQRCodeResponse = await this.qrCodeService.createQRCode();
      return createQRCodeResponse;
    } catch (error) {
      logger.error(`[resolver:QRCode:createQRCode] ${error.message}.`);
      throw error;
    }
  }

  @Query(() => QRCodesResponse, { description: 'Get all QR Codes.' })
  @UseMiddleware(isAuth)
  async qrCodes(): Promise<QRCodesResponse> {
    try {
      const qrCodes = await this.qrCodeService.getQRCodes();
      return qrCodes;
    } catch (error) {
      logger.error(`[resolver:QRCode:qrCodes] ${error.message}.`);
      throw error;
    }
  }

  @Query(() => PaginatedQRCodeResponse, { description: 'Get QR Codes page by page (by fixing the page and the limit of QR Codes by page).' })
  async qrCodesWithPagination(@Arg('paginatorInput') paginatorInput: PaginatorInput): Promise<PaginatedQRCodeResponse> {
    try {
      const qrCodes = await this.qrCodeService.getQRCodesWithPagination(paginatorInput);
      return qrCodes;
    } catch (error) {
      logger.error(`[resolver:QRCode:qrCodesWithPagination] ${error.message}.`);
      throw error;
    }
  }
}

export default QRCodeResolver;
