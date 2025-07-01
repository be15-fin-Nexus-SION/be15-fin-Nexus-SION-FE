import api from './axios';

export function uploadImage(file, prefix = 'profile') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('prefix', prefix);

    return api.post('/image/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
}