import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useTheme } from '@react-navigation/native';

const AnimatedView = Animated.createAnimatedComponent(View);

const SIZE = 64;
const STROKE_WIDTH = 6;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export const Loader = () => {
  const rotate = useSharedValue(0);
  const { colors } = useTheme();

  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, {
        duration: 1200,
        easing: Easing.linear,
      }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
  }));

  return (
    <View style={styles.container}>
      <AnimatedView style={[styles.spinner, animatedStyle]}>
        <Svg width={SIZE} height={SIZE}>
          <Circle
            stroke="#D1D5DB"
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
          <Circle
            stroke={colors.primary}
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={`${CIRCUMFERENCE * 0.75}`} 
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </AnimatedView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  spinner: {
    width: SIZE,
    height: SIZE,
  },
});
