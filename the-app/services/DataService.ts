import {File, Directory, Paths} from 'expo-file-system'

export interface ImageItem {
  filename: string;
  description: string;
  data: string;
}

export interface ImagesResponse {
  images: ImageItem[];
}

const API_BASE_URL = "http://10.0.2.2:8000";

export const DataService = {
  
    async saveImageLocally(image: string, filename: string) {
        try {
            const destDir = new Directory(Paths.document, "sub");
            if(!destDir.exists){
                destDir.create();
            }
            const destPath = new File(destDir, filename);
            const oldImage = new File(image);
            oldImage.copy(destPath);
            console.log(oldImage, destDir, destPath)
            return destPath.uri;
        } catch (error) {
            console.error('Error saving image:', error);
            throw error;
        }
    },

    async getLocalImages() : Promise<ImageItem[]> {
        try {
            const destDir = new Directory(Paths.document, "sub");
            const files = destDir.listAsRecords();
            
            const images: ImageItem[] = files
            .filter(file => !file.isDirectory)
            .map(file => {
                const filename = file.uri.replace(/\/$/, '').split('/').pop() || '';
                const name = filename.replace(/\.[^/.]+$/, '');
                
                //fuckass parsing to get description
                const description = name.replace(/_/g, ' ').replace(/-/g, ' ')
                .replace(/\b\w/g, c => c.toUpperCase());
                
                return {
                filename,
                description,
                data: file.uri,
                };
            });
            images.forEach(image => {
                console.log(image.filename, image.data)
            });
            return images;
        } catch (error) {
            console.error('Error getting local images:', error);
            throw error;
        }
    },

    async getImages(): Promise<ImageItem[]> {
        try {
        const response = await fetch(`${API_BASE_URL}/list`);
        
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        
        const data: ImagesResponse = await response.json();
        return data.images;
        } catch (error) {
        console.error("Failed to fetch images:", error);
        throw error;
        }
    },

    async checkHealth(): Promise<boolean> {
        try {
        const response = await fetch(`${API_BASE_URL}/health`);
        return response.ok;
        } catch {
        return false;
        }
    }
};