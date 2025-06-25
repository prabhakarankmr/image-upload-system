import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import * as sharp from 'sharp';


@Injectable()
export class ImageService {

  async moveToTrash(id: string) {
  return this.prisma.image.update({
    where: { id },
    data: {
      deletedStatus: 1,
      deletedAt: new Date(),
      trash: true,
    },
  });
}
  async deleteImage(id: string) {
  const image = await this.prisma.image.findUnique({ where: { id } });
  if (!image) throw new Error('Image not found');

  // Delete files
  if (fs.existsSync(image.path)) fs.unlinkSync(image.path);
  // If you store raw file info, delete that too:
  // if (fs.existsSync(image.rawFilePath)) fs.unlinkSync(image.rawFilePath);

  // Delete DB row
  await this.prisma.image.delete({ where: { id } });
}
  private prisma = new PrismaClient();

  async saveImage(file: any): Promise<any> {
    // Validate file type
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Generate unique filename
     const rawFilename = file.originalname || file.filename;
     const id = uuidv4();
     const originalExtension = path.extname(file.originalname || file.filename);
     const webpFilename = `${id}.webp`;
     const uploadDir = path.join(process.cwd(), '../uploads');
     const rawFilePath = path.join(uploadDir, rawFilename);
     const webpFilePath = path.join(uploadDir, webpFilename);

    // Ensure upload directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Get buffer from file
  const buffer = await file.toBuffer();

  // Save raw file
  fs.writeFileSync(rawFilePath, buffer);

    // Convert and compress to webp
  const compressedBuffer = await sharp(buffer)
    .webp({ quality: 70 })
    .toBuffer();

  fs.writeFileSync(webpFilePath, compressedBuffer);

    const imageRecord = await this.prisma.image.create({
    data: {
      filename: webpFilename, // main reference filename
      originalName: file.originalname || file.filename,
      mimetype: 'image/webp',
      size: compressedBuffer.length,
      path: webpFilePath,
      
      // Optionally, store raw file info as well:
      // rawFilename,
      // rawFilePath,
      // rawSize: buffer.length,
    },
  });

  return {
    ...imageRecord,
    rawFilename,
    rawFilePath,
    rawSize: buffer.length,
    webpFilename,
    webpFilePath,
    webpSize: compressedBuffer.length,
  };
}
  async getAllImages() {
    return this.prisma.image.findMany({
      orderBy: {
        uploadedAt: 'desc',
      },
    });
  }

  async getImageById(id: string) {
    return this.prisma.image.findUnique({
      where: { id },
    });
  }
  
}

