import React, { useRef, type ReactNode } from "react";
import {
  Pressable,
  Animated,
  type ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";

interface PressableCardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  scaleTo?: number;
  haptic?: boolean;
  disabled?: boolean;
}

export function PressableCard({
  children,
  onPress,
  style,
  scaleTo = 0.96,
  haptic = false,
  disabled = false,
}: PressableCardProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    if (haptic) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.spring(scale, {
      toValue: scaleTo,
      friction: 8,
      tension: 100,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 60,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <Animated.View
        style={[
          style,
          { transform: [{ scale }] },
        ]}
      >
        {children}
      </Animated.View>
    </Pressable>
  );
}
