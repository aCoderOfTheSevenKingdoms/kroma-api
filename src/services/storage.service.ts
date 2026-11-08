import ImageKit, { toFile } from '@imagekit/nodejs';
import { config } from '../config/config.js';
import fs from 'fs';
import path from 'path';

const client = new ImageKit({
    privateKey: config.IMAGEKIT_PRIVATE_KEY
})

type UploadFileOptions = {
    filePath: string;
    fileName?: string;
    folder?: string;
}

export async function uploadFile({ filePath, fileName, folder }: UploadFileOptions) {
    const response = await client.files.upload({
        file: fs.createReadStream(filePath),
        fileName: fileName ?? path.basename(filePath),
        ...(folder ? { folder } : {})
    });

    return response;
}

type UploadBufferOptions = {
    buffer: Buffer;
    fileName?: string;
    folder?: string;
    mimeType?: string;
}

export async function uploadBuffer({ buffer, fileName, folder, mimeType }: UploadBufferOptions) {
    const name = fileName ?? "file";
    const file = await toFile(buffer, name, mimeType ? { type: mimeType } : {});

    const response = await client.files.upload({
        file,
        fileName: name,
        ...(folder ? { folder } : {})
    });

    return response;
}
