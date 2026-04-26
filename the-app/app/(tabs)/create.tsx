import { View, StyleSheet, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

import Button from '@/components/Button';
import ImageViewer from '@/components/ImageViewer';
import { DataService } from '@/services/DataService';

const PlaceholderImage = require('@/assets/images/background-image.png');

export default function Create() {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);
  const [filename, setFilename] = useState<string>('');

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const onSaveImageAsync = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please choose an image first.');
      return;
    }

    if (!filename.trim()) {
      Alert.alert('No filename', 'Please enter a filename for the image.');
      return;
    }

    try {
      const savedPath = await DataService.saveImageLocally(selectedImage, filename.trim());
      Alert.alert('Success', `Image saved to: ${savedPath}`);
      setSelectedImage(undefined);
      setFilename('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save image. Please try again.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} selectedImage={selectedImage} />
      </View>
      <TextInput 
        style={styles.textInput}
        value={filename}
        onChangeText={setFilename}
        placeholder="Enter filename"
        placeholderTextColor="#666"
      />
      <View style={styles.footerContainer}>
        <Button theme="primary" label="Choose a photo" onPress={pickImageAsync} />
        <Button label="Save photo locally" onPress={onSaveImageAsync} />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6b736',
    alignItems: 'center',
  },
  imageContainer: {
    flex: 1,
    marginTop: 20
  },
  footerContainer: {
    flex: 1 / 2,
    alignItems: 'center',
  },
  optionsContainer: {
    position: 'absolute',
    bottom: 80,
  },
  optionsRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  textInput: {
    height: 50,
    width: '80%',
    marginBottom: 40,
    marginTop: 100,
    backgroundColor: '#c2c2c2',
    borderWidth: 1,
    padding: 10,
    fontSize: 20,
  }
});
