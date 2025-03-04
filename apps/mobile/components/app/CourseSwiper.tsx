import React, { useCallback } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  SharedValue,
  runOnJS,
} from "react-native-reanimated";
import { router } from "expo-router";
const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.8;
const SPACING = 16;

interface Slide {
  id: string;
  title: string;
  level: string;
  backgroundColor: string;
  progress: number;
}

interface CourseCardProps {
  slide: Slide;
  index: number;
  scrollX: SharedValue<number>;
}

interface CourseSwiperProps {
  onSlideChange?: (index: number) => void;
}

const slides: Slide[] = [
  {
    id: "1",
    title: "B1",
    level: "Beginner",
    backgroundColor: "#FF7B92",
    progress: 0.7,
  },
  {
    id: "2",
    title: "B2",
    level: "Beginner",
    backgroundColor: "#8B1E3F",
    progress: 0.3,
  },
  {
    id: "3",
    title: "A1",
    level: "Beginner",
    backgroundColor: "#9B6B9E",
    progress: 0.1,
  },
];

const CourseCard: React.FC<CourseCardProps> = ({ slide, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scale = interpolate(scrollX.value, input, [0.95, 1, 0.95], "clamp");
    const opacity = interpolate(scrollX.value, input, [0.85, 1, 0.85], "clamp");

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const handlePress = () => {
    // Navigate to the course screen outside of tabs navigation
    router.push({
      pathname: "/(app)/(index)/[id]",
      params: {
        id: slide.id,
        title: slide.title,
      },
    });
  };

  return (
    <Animated.View style={[styles.slide, animatedStyle]}>
      <Pressable
        onPress={handlePress}
        style={({ pressed }) => [styles.pressable, pressed && styles.pressed]}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: slide.backgroundColor,
            },
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.level}>{slide.level}</Text>

            <View style={styles.progressContainer}>
              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${slide.progress * 100}%` },
                  ]}
                />
              </View>
              {/* <Text style={styles.progressText}>
                {Math.round(slide.progress * 100)}% complete
              </Text> */}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const CourseSwiper: React.FC<CourseSwiperProps> = ({ onSlideChange }) => {
  const scrollX = useSharedValue(0);

  const updateCurrentSlide = useCallback(
    (x: number) => {
      const slideIndex = Math.round(x / (CARD_WIDTH + SPACING));
      onSlideChange?.(slideIndex);
    },
    [onSlideChange],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      if (onSlideChange) {
        runOnJS(updateCurrentSlide)(event.contentOffset.x);
      }
    },
  });

  return (
    <View>
      <Text
        style={{
          fontSize: 22,
          fontWeight: "bold",
          marginVertical: 22,
          paddingHorizontal: 20,
        }}
      >
        Доступні курси
      </Text>
      <View style={styles.container}>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + SPACING}
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          contentContainerStyle={styles.scrollContent}
        >
          {slides.map((slide, index) => (
            <CourseCard
              key={slide.id}
              slide={slide}
              index={index}
              scrollX={scrollX}
            />
          ))}
        </Animated.ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 150,
  },
  scrollContent: {
    paddingLeft: 20,
    paddingRight: width * 0.2,
    gap: SPACING,
  },
  slide: {
    width: CARD_WIDTH,
  },
  pressable: {
    width: "100%",
    height: "100%",
  },
  pressed: {
    opacity: 0.9,
  },
  card: {
    height: 150,
    width: CARD_WIDTH,
    borderWidth: 1,
    borderColor: "#C089FF",
    borderRadius: 20,
    backgroundImage: "linear-gradient(to right, #C089FF, #8B1E3F)",
    padding: 20,
    justifyContent: "flex-start",
  },
  textContainer: {
    gap: 8,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  level: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBackground: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#fff",
    borderRadius: 3,
  },
  progressText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    marginTop: 4,
  },
});

export default CourseSwiper;
