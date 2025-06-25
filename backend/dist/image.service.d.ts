export declare class ImageService {
    moveToTrash(id: string): Promise<{
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
    }>;
    deleteImage(id: string): Promise<void>;
    private prisma;
    saveImage(file: any): Promise<any>;
    getAllImages(): Promise<{
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
    }[]>;
    getImageById(id: string): Promise<{
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
    } | null>;
}
