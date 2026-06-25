import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Colors, BorderRadius } from "../theme/colors";

interface AnimatedProgressProps {
  progress: number; // 0-100
  height?: number;
}

export function AnimatedProgress({
  progress,
  height = 8,
}: AnimatedProgressProps) {
  const fillAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(fillAnim, {
      toValue: progress,
      friction: 10,
      tension: 40,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  return (
    <View
      style={[
        styles.track,
        { height },
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            height,
            borderRadius: height / 2,
            width: fillAnim.interpolate({
              inputRange: [0, 100],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: BorderRadius.round,
    backgroundColor: Colors.secondary,
    overflow: "hidden",
  },
  fill: {
    backgroundColor: Colors.primary,
  },
});
