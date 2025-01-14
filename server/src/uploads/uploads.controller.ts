import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

@Controller('uploads')
export class UploadsController {
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file) {
    AWS.config.update({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    try {
      const { Location: url } = await new AWS.S3()
        .upload({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Body: file.buffer,
          Key: `${uuidv4()}-${Date.now()}`,
          ACL: 'public-read',
        })
        .promise();

      return { url };
    } catch {
      console.log('Failed to upload file');
    }
  }
}
