import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Platform, Image } from 'react-native';

export default function TabLayout() {
  const iosFolderIcon = require('@/assets/images/ios-folder-icon.png');
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffd33d',
        headerStyle: {
        backgroundColor: '#25292e',
        },
        headerShadowVisible: false,
        headerTintColor: '#fff',
        tabBarStyle: {
        backgroundColor: '#25292e',
        },
    }}
    >
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'add-circle' : 'add-outline'} color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="Local"
        options={{
          title: 'Local',
          tabBarIcon: ({ color, focused }) => 
            Platform.OS === 'ios' ? (
              <Image
                source={iosFolderIcon}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: color,
                  opacity: focused ? 1 : 0.7,
                }}
                resizeMode="contain"
              />
            ) : (
              <Ionicons
                name={focused ? 'folder' : 'folder-outline'}
                color={color}
                size={24}
              />
            ),
          
        }}
      />
      <Tabs.Screen
        name="list"
        options={{
          title: 'List',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
    
  );
  
}
