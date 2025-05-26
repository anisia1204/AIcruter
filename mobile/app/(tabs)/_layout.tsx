import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text } from 'react-native';
import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { useTheme } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import BackIcon from '@/components/atoms/BackButton';

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
          tabBarIcon: ({ color }) => <FontAwesome name="suitcase" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applications',
          tabBarIcon: ({ color }) => <Ionicons name="documents" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="companies/index"
        options={{
          title: 'Companies',
          tabBarIcon: ({ color }) => <MaterialIcons name="corporate-fare" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="companies/companyDetails/[id]"
        options={{
          href: null,
          animation: 'fade',
          headerTitleAlign: 'left',
          headerLeft: () => <BackIcon backPage='/(tabs)/companies' />,
          headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
              Company Details
            </Text>
          ),
        }}
      />
    </Tabs>
  );
}

export default TabLayout;