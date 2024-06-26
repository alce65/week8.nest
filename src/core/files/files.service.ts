import { Injectable, Logger } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';

@Injectable()
export class FilesService {
  constructor(private readonly logger: Logger) {
    this.logger.debug('Instantiated', 'FilesService');
  }

  async uploadImage(
    owner: string,
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const options = {
      folder: 'nest_2024_1',
      public_id: `${owner}_${file.fieldname}_${file.originalname}`,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      use_filename: true,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      unique_filename: false,
      overwrite: true,
    };

    // const finalPath = file.destination + '/' + file.filename;
    // const result = await v2.uploader.upload(finalPath, options);
    return new Promise((resolve, reject) => {
      v2.uploader
        .upload_stream(options, (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        })
        .end(file.buffer);
    });
  }
}
