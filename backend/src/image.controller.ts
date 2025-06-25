import {
  Controller,
  Post,
  Get,
  Param,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Delete,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
import { ImageService } from './image.service';
import * as fs from 'fs';
import * as path from 'path';

@Controller('api/images')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post('upload')
  async uploadImage(@Req() request: FastifyRequest, @Res() reply: FastifyReply) {
    try {
      // Cast request to any to access the file method
      const data = await (request as any).file();
      
      if (!data) {
        throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
      }

      const savedImage = await this.imageService.saveImage(data);
      
      reply.status(200).send({
        success: true,
        message: 'Image uploaded successfully!',
        data: {
          id: savedImage.id,
          filename: savedImage.filename,
          originalName: savedImage.originalName,
          mimetype: savedImage.mimetype,
          size: savedImage.size,
          uploadedAt: savedImage.uploadedAt,
        },
      });
    } catch (error) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Failed to upload image',
      });
    }
  }

  @Get()
  async getAllImages() {
  try {
    const images = await this.imageService.getAllImages();

    // Map each image to include webpUrl and rawUrl
    const imagesWithUrls = images.map(img => ({
      ...img,
      webpUrl: `/api/images/webp/${img.filename}`,
      rawUrl: `/api/images/raw/${img.originalName}`, 
    }));

    return {
      success: true,
      data: imagesWithUrls,
    };
  } catch (error) {
    throw new HttpException(
      'Failed to fetch images',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

  @Get(':id')
  async getImage(@Param('id') id: string, @Res() reply: FastifyReply) {
    try {
      const image = await this.imageService.getImageById(id);
      
      if (!image) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      if (!fs.existsSync(image.path)) {
        throw new HttpException('Image file not found', HttpStatus.NOT_FOUND);
      }

      const fileStream = fs.createReadStream(image.path);
      reply.type(image.mimetype);
      reply.send(fileStream);
    } catch (error) {
      reply.status(404).send({
        success: false,
        message: error.message || 'Image not found',
      });
    }
  }
  @Post('trash/:id')
  async moveToTrash(@Param('id') id: string, @Res() reply: FastifyReply) {
    try {
      const image = await this.imageService.getImageById(id);
      
      if (!image) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      // Move the image to trash (or delete it)
      await this.imageService.moveToTrash(id);

      reply.status(200).send({
        success: true,
        message: 'Image moved to trash successfully!',
      });
    } catch (error) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Failed to move image to trash',
      });
    }
  }
  @Delete(':id')
  async deleteImage(@Param('id') id: string, @Res() reply: FastifyReply) {
    try {
      const image = await this.imageService.getImageById(id);
      
      if (!image) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      // Delete the image file from the filesystem
      if (fs.existsSync(image.path)) {
        fs.unlinkSync(image.path);
      }

      // Delete the image record from the database
      await this.imageService.deleteImage(id);

      reply.status(200).send({
        success: true,
        message: 'Image deleted permanently!',
      });
    } catch (error) {
      reply.status(400).send({
        success: false,
        message: error.message || 'Failed to delete image',
      });
    }
  } 
  @Get('webp/:filename')
  async serveWebp(@Param('filename') filename: string, @Res() reply: FastifyReply) {
  const filePath = path.join(process.cwd(), '../uploads', filename);
  if (!fs.existsSync(filePath)) {
    reply.status(404).send({ success: false, message: 'WebP image not found' });
    return;
  }
  reply.type('image/webp');
  const fileStream = fs.createReadStream(filePath);
  reply.send(fileStream);
}
@Get('raw/:filename')
async serveRaw(@Param('filename') filename: string, @Res() reply: FastifyReply) {
  const filePath = path.join(process.cwd(), '../uploads', filename);
  if (!fs.existsSync(filePath)) {
    reply.status(404).send({ success: false, message: 'Raw file not found' });
    return;
  }
  // Set content-disposition for download
  reply.header('Content-Disposition', `attachment; filename="${filename}"`);
  const fileStream = fs.createReadStream(filePath);
  reply.send(fileStream);
}

}

