import { StyleSheet, View, Button, Text } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState } from 'react';
import { apiGet } from '@/lib/api';

export default function TabTwoScreen() {
  const [message, setMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const response = await apiGet('/api/user-account');  
      setMessage(response); 
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <View>
        <Button title="Get User Account Info" onPress={fetchData} />
        <Text style={{color: "white"}}>{message ? message : 'Click the button to fetch data'}</Text>
      </View>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
