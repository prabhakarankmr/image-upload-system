"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageController = void 0;
const common_1 = require("@nestjs/common");
const image_service_1 = require("./image.service");
const fs = require("fs");
const path = require("path");
let ImageController = class ImageController {
    imageService;
    constructor(imageService) {
        this.imageService = imageService;
    }
    async uploadImage(request, reply) {
        try {
            const data = await request.file();
            if (!data) {
                throw new common_1.HttpException('No file uploaded', common_1.HttpStatus.BAD_REQUEST);
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
        }
        catch (error) {
            reply.status(400).send({
                success: false,
                message: error.message || 'Failed to upload image',
            });
        }
    }
    async getAllImages() {
        try {
            const images = await this.imageService.getAllImages();
            const imagesWithUrls = images.map(img => ({
                ...img,
                webpUrl: `/api/images/webp/${img.filename}`,
                rawUrl: `/api/images/raw/${img.originalName}`,
            }));
            return {
                success: true,
                data: imagesWithUrls,
            };
        }
        catch (error) {
            throw new common_1.HttpException('Failed to fetch images', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getImage(id, reply) {
        try {
            const image = await this.imageService.getImageById(id);
            if (!image) {
                throw new common_1.HttpException('Image not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (!fs.existsSync(image.path)) {
                throw new common_1.HttpException('Image file not found', common_1.HttpStatus.NOT_FOUND);
            }
            const fileStream = fs.createReadStream(image.path);
            reply.type(image.mimetype);
            reply.send(fileStream);
        }
        catch (error) {
            reply.status(404).send({
                success: false,
                message: error.message || 'Image not found',
            });
        }
    }
    async moveToTrash(id, reply) {
        try {
            const image = await this.imageService.getImageById(id);
            if (!image) {
                throw new common_1.HttpException('Image not found', common_1.HttpStatus.NOT_FOUND);
            }
            await this.imageService.moveToTrash(id);
            reply.status(200).send({
                success: true,
                message: 'Image moved to trash successfully!',
            });
        }
        catch (error) {
            reply.status(400).send({
                success: false,
                message: error.message || 'Failed to move image to trash',
            });
        }
    }
    async deleteImage(id, reply) {
        try {
            const image = await this.imageService.getImageById(id);
            if (!image) {
                throw new common_1.HttpException('Image not found', common_1.HttpStatus.NOT_FOUND);
            }
            if (fs.existsSync(image.path)) {
                fs.unlinkSync(image.path);
            }
            await this.imageService.deleteImage(id);
            reply.status(200).send({
                success: true,
                message: 'Image deleted permanently!',
            });
        }
        catch (error) {
            reply.status(400).send({
                success: false,
                message: error.message || 'Failed to delete image',
            });
        }
    }
    async serveWebp(filename, reply) {
        const filePath = path.join(process.cwd(), '../uploads', filename);
        if (!fs.existsSync(filePath)) {
            reply.status(404).send({ success: false, message: 'WebP image not found' });
            return;
        }
        reply.type('image/webp');
        const fileStream = fs.createReadStream(filePath);
        reply.send(fileStream);
    }
    async serveRaw(filename, reply) {
        const filePath = path.join(process.cwd(), '../uploads', filename);
        if (!fs.existsSync(filePath)) {
            reply.status(404).send({ success: false, message: 'Raw file not found' });
            return;
        }
        reply.header('Content-Disposition', `attachment; filename="${filename}"`);
        const fileStream = fs.createReadStream(filePath);
        reply.send(fileStream);
    }
};
exports.ImageController = ImageController;
__decorate([
    (0, common_1.Post)('upload'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "uploadImage", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getAllImages", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "getImage", null);
__decorate([
    (0, common_1.Post)('trash/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "moveToTrash", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "deleteImage", null);
__decorate([
    (0, common_1.Get)('webp/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "serveWebp", null);
__decorate([
    (0, common_1.Get)('raw/:filename'),
    __param(0, (0, common_1.Param)('filename')),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ImageController.prototype, "serveRaw", null);
exports.ImageController = ImageController = __decorate([
    (0, common_1.Controller)('api/images'),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], ImageController);
//# sourceMappingURL=image.controller.js.map