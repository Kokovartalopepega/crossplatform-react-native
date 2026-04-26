// filepath: the-app/services/DataService.ts

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