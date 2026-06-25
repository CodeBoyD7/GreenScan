import React, { useEffect, useRef, useState } from "react";
import { Text, Animated, type TextStyle } from "react-native";

interface AnimatedCounterProps {
  from?: number;
  to: number;
  duration?: number;
  decimals?: number;
  style?: TextStyle;
}

export function AnimatedCounter({
  from = 0,
  to,
  duration = 1200,
  decimals = 0,
  style,
}: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState(from);
  const animatedValue = useRef(new Animated.Value(from)).current;

  useEffect(() => {
    animatedValue.setValue(from);
    const listener = animatedValue.addListener(({ value }) => {
      setDisplayed(value);
    });

    Animated.timing(animatedValue, {
      toValue: to,
      duration,
      useNativeDriver: false, // need false since we read via listener
    }).start();

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [from, to, duration]);

  return (
    <Text style={style}>
      {displayed.toFixed(decimals)}
    </Text>
  );
}
