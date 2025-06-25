"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const uuid_1 = require("uuid");
const sharp = require("sharp");
let ImageService = class ImageService {
    async moveToTrash(id) {
        return this.prisma.image.update({
            where: { id },
            data: {
                deletedStatus: 1,
                deletedAt: new Date(),
                trash: true,
            },
        });
    }
    async deleteImage(id) {
        const image = await this.prisma.image.findUnique({ where: { id } });
        if (!image)
            throw new Error('Image not found');
        if (fs.existsSync(image.path))
            fs.unlinkSync(image.path);
        await this.prisma.image.delete({ where: { id } });
    }
    prisma = new client_1.PrismaClient();
    async saveImage(file) {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        }
        const rawFilename = file.originalname || file.filename;
        const id = (0, uuid_1.v4)();
        const originalExtension = path.extname(file.originalname || file.filename);
        const webpFilename = `${id}.webp`;
        const uploadDir = path.join(process.cwd(), '../uploads');
        const rawFilePath = path.join(uploadDir, rawFilename);
        const webpFilePath = path.join(uploadDir, webpFilename);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        const buffer = await file.toBuffer();
        fs.writeFileSync(rawFilePath, buffer);
        const compressedBuffer = await sharp(buffer)
            .webp({ quality: 70 })
            .toBuffer();
        fs.writeFileSync(webpFilePath, compressedBuffer);
        const imageRecord = await this.prisma.image.create({
            data: {
                filename: webpFilename,
                originalName: file.originalname || file.filename,
                mimetype: 'image/webp',
                size: compressedBuffer.length,
                path: webpFilePath,
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
    async getImageById(id) {
        return this.prisma.image.findUnique({
            where: { id },
        });
    }
};
exports.ImageService = ImageService;
exports.ImageService = ImageService = __decorate([
    (0, common_1.Injectable)()
], ImageService);
//# sourceMappingURL=image.service.js.map