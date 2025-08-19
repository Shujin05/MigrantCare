import React, { useRef } from 'react';
import {
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  ViewStyle,
  View,
  ImageSourcePropType,
  Image,
} from 'react-native';

interface Props {
  label: string;
  onPress: () => void;
  color?: string;
  style?: ViewStyle;
  imageSource?: ImageSourcePropType;
  imageSize?: number;
}

export default function LabelButton({
  label,
  onPress,
  color,
  style,
  imageSource,
  imageSize,
}: Props) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 10,
    }).start(() => onPress());
  };

  return (
    <TouchableWithoutFeedback onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.button,
          { backgroundColor: color, transform: [{ scale: scaleAnim }] },
          style,
        ]}
      >
        <View style={styles.content}>
          {imageSource && (
            <Image
              source={imageSource}
              style={{ width: imageSize, height: imageSize, marginBottom: 6 }}
              resizeMode="contain"
            />
          )}
          <Text style={styles.label}>{label}</Text>
        </View>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    justifyContent: 'center', 
    textAlign: "center", 
  },
});
