import { FastifyRequest, FastifyReply } from 'fastify';
import { ImageService } from './image.service';
export declare class ImageController {
    private readonly imageService;
    constructor(imageService: ImageService);
    uploadImage(request: FastifyRequest, reply: FastifyReply): Promise<void>;
    getAllImages(): Promise<{
        success: boolean;
        data: {
            webpUrl: string;
            rawUrl: string;
            id: string;
            filename: string;
            originalName: string;
            mimetype: string;
            size: number;
            path: string;
            uploadedAt: Date;
            deletedStatus: number;
            deletedAt: Date | null;
            trash: boolean;
        }[];
    }>;
    getImage(id: string, reply: FastifyReply): Promise<void>;
    moveToTrash(id: string, reply: FastifyReply): Promise<void>;
    deleteImage(id: string, reply: FastifyReply): Promise<void>;
    serveWebp(filename: string, reply: FastifyReply): Promise<void>;
    serveRaw(filename: string, reply: FastifyReply): Promise<void>;
}
