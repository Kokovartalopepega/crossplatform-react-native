import { useEffect, useState } from 'react';
import { Text, View, StyleSheet, FlatList, Image, ActivityIndicator, Pressable } from 'react-native';
import { DataService, type ImageItem } from '@/services/DataService';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function LoaclScreen() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
    //health()
  }, []);

  const health = async () => {
    const response = await DataService.checkHealth();
    alert(`Health check: ${response}`);
  }

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await DataService.getLocalImages();
      setImages(data);
      setError(null);
    } catch (err) {
      setError('Failed to load images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImage = async (image: ImageItem) => {
    const response = await DataService.uploadImage(image);
    alert(`Image uploaded?: ${response}`)
  }

  const listItem = ({ item }: { item: ImageItem }) => (
    <View style={styles.imageContainer}>
      <Pressable 
      style={styles.uploadButton} 
      onPress={() => handleUploadImage(item)}
    >
      <MaterialIcons name="add" size={38} color="#25292e" />
    </Pressable>
        
        <Image source={{ uri: item.data }} style={styles.image} resizeMode="cover" />
        <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={listItem}
        keyExtractor={(item) => item.data}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6b736',
  },
  list: {
    padding: 16,
  },
  imageContainer: {
    borderColor: 'rgb(255, 157, 10)',
    borderWidth: 4,
    marginBottom: 16,
    backgroundColor: '#726415',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  uploadButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffeaaf',
    borderRadius: 20,
    padding: 4,
    zIndex: 1,
  },
  description: {
    color: '#fff',
    fontSize: 16,
    padding: 12,
    textAlign: 'center',
  },
  error: {
    color: '#ff6b6b',
    fontSize: 16,
    textAlign: 'center',
  },
});
