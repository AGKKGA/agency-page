/**
 * Upload a file to Cloudinary
 * @param file - The file to upload
 * @param folder - The folder path in Cloudinary (e.g., 'profile-pictures', 'documents')
 * @returns The secure URL of the uploaded file
 */
export async function uploadToCloudinary(
    file: File,
    folder: string
): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    formData.append('folder', `agency/${folder}`);

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        {
            method: 'POST',
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error('Failed to upload file to Cloudinary');
    }

    const data = await response.json();
    return data.secure_url;
}

/**
 * Upload multiple files to Cloudinary
 * @param files - Array of files to upload
 * @param folder - The folder path in Cloudinary
 * @returns Array of secure URLs
 */
export async function uploadMultipleToCloudinary(
    files: File[],
    folder: string
): Promise<string[]> {
    const uploadPromises = files.map(file => uploadToCloudinary(file, folder));
    return Promise.all(uploadPromises);
}
