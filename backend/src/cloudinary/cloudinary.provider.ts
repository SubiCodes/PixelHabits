/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    cloudinary.config({
      secure: true,
    });
    
    console.log('Cloudinary configured:', {
      cloud_name: cloudinary.config().cloud_name,
      api_key: cloudinary.config().api_key ? '***' : undefined,
    });
    
    return cloudinary;
  },
};