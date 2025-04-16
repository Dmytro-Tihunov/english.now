import React, { useRef, useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  PanResponder,
  Modal,
} from "react-native";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const BOTTOM_SHEET_HEIGHT = SCREEN_HEIGHT * 0.5;

interface CommonBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const CommonBottomSheet: React.FC<CommonBottomSheetProps> = ({
  isVisible,
  onClose,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isVisible) {
      animation.setValue(0);
      setIsOpen(true);
      Animated.spring(animation, {
        toValue: 1,
        useNativeDriver: true,
        bounciness: 5,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setIsOpen(false);
      });
    }
  }, [isVisible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > BOTTOM_SHEET_HEIGHT * 0.3) {
          Animated.timing(animation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setIsOpen(false);
            onClose();
          });
        } else {
          Animated.spring(animation, {
            toValue: 1,
            useNativeDriver: true,
            bounciness: 5,
          }).start();
          pan.setValue({ x: 0, y: 0 });
        }
      },
    }),
  ).current;

  if (!isOpen && !isVisible) return null;

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [BOTTOM_SHEET_HEIGHT, 0],
  });

  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              transform: [{ translateY }, { translateY: pan.y }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  bottomSheet: {
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: "#ddd",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 10,
  },
});

export default CommonBottomSheet;
