import { useState } from "react";
import { PanResponder, Text, View } from "react-native";

type WordCountSliderProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

const THUMB_SIZE = 28;

export function WordCountSlider({ min, max, value, onChange }: WordCountSliderProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [startLocationX, setStartLocationX] = useState(0);

  const updateFromX = (x: number) => {
    const ratio = Math.min(1, Math.max(0, x / trackWidth));
    onChange(Math.round(min + ratio * (max - min)));
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (event) => {
      setStartLocationX(event.nativeEvent.locationX);
      updateFromX(event.nativeEvent.locationX);
    },
    onPanResponderMove: (_event, gestureState) => {
      updateFromX(startLocationX + gestureState.dx);
    },
  });

  const ratio = (value - min) / (max - min);

  return (
    <View className="gap-1">
      <View style={{ marginLeft: `${ratio * 100}%` }}>
        <Text
          className="font-nunito-bold text-body-lg text-brown"
          style={{ transform: [{ translateX: -10 }] }}
        >
          {value}
        </Text>
      </View>

      <View
        className="justify-center py-3"
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        {...panResponder.panHandlers}
      >
        <View className="h-2 overflow-hidden rounded-full bg-tan">
          <View className="h-full rounded-full bg-amber" style={{ width: `${ratio * 100}%` }} />
        </View>
        <View
          className="absolute rounded-full bg-tan"
          style={{
            width: THUMB_SIZE,
            height: THUMB_SIZE,
            left: `${ratio * 100}%`,
            transform: [{ translateX: -THUMB_SIZE / 2 }],
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 3,
            shadowOffset: { width: 0, height: 2 },
            elevation: 2,
          }}
        />
      </View>

      <View className="flex-row justify-between">
        <Text className="font-nunito-bold text-body-sm text-brown">{min}</Text>
        <Text className="font-nunito-bold text-body-sm text-brown">{max}</Text>
      </View>
    </View>
  );
}
