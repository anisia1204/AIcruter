import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTheme } from '@react-navigation/native';

const TabLayout = () => {

  const { colors } = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Jobs',
          animation: 'fade',
          headerTitleAlign: 'left',
          tabBarIcon: ({ color }) => <Icon name="check-circle" size={24} color="green" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
         tabBarIcon: ({ color }) => <Icon name="check-circle" size={24} color="green" />,
        }}
      />
    </Tabs>
  );
}

export default TabLayout;