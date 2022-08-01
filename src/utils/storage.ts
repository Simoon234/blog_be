import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import * as mime from 'mime';

export const storageDirectory = () => {
    return path.join(__dirname, '../../storage');
};

export function multerStorage(dist: string) {
    return diskStorage({
        destination: (req, file, cb) => cb(null, dist),
        filename: (req, file, cb) =>
            cb(null, `${uuid()}.${(mime as any).getExtension(file.mimetype)}`),
    });
}
