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

interface WordCategory {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
  wordCount: number;
  icon?: string;
}

interface WordCardProps {
  category: WordCategory;
  index: number;
  scrollX: SharedValue<number>;
}

interface WordsSwiperProps {
  onCategoryChange?: (index: number) => void;
}

// Sample word categories
const wordCategories: WordCategory[] = [
  {
    id: "basics",
    title: "Basics",
    description: "Essential everyday words",
    backgroundColor: "#4CAF50",
    wordCount: 100,
  },
  {
    id: "travel",
    title: "Travel",
    description: "Words for your journey",
    backgroundColor: "#2196F3",
    wordCount: 75,
  },
  {
    id: "business",
    title: "Business",
    description: "Professional vocabulary",
    backgroundColor: "#9C27B0",
    wordCount: 120,
  },
  {
    id: "food",
    title: "Food",
    description: "Culinary expressions",
    backgroundColor: "#FF9800",
    wordCount: 80,
  },
  {
    id: "technology",
    title: "Technology",
    description: "Digital world terms",
    backgroundColor: "#607D8B",
    wordCount: 90,
  },
];

const WordCard: React.FC<WordCardProps> = ({ category, index, scrollX }) => {
  const animatedStyle = useAnimatedStyle(() => {
    const input = [
      (index - 1) * (CARD_WIDTH + SPACING),
      index * (CARD_WIDTH + SPACING),
      (index + 1) * (CARD_WIDTH + SPACING),
    ];

    const scale = interpolate(scrollX.value, input, [0.9, 1, 0.9], "clamp");
    const opacity = interpolate(scrollX.value, input, [0.7, 1, 0.7], "clamp");

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const handlePress = () => {
    // Navigate to the vocabulary category screen
    router.push({
      pathname: "/(app)/(index)/[words]",
      params: {
        words: category.id,
        title: category.title,
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
              backgroundColor: category.backgroundColor,
            },
          ]}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>{category.title}</Text>
            <Text style={styles.description}>{category.description}</Text>

            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>{category.wordCount} words</Text>
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

const WordsSwiper: React.FC<WordsSwiperProps> = ({ onCategoryChange }) => {
  const scrollX = useSharedValue(0);

  const updateCurrentCategory = useCallback(
    (x: number) => {
      const categoryIndex = Math.round(x / (CARD_WIDTH + SPACING));
      onCategoryChange?.(categoryIndex);
    },
    [onCategoryChange],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
      if (onCategoryChange) {
        runOnJS(updateCurrentCategory)(event.contentOffset.x);
      }
    },
  });

  return (
    <View>
      <Text style={styles.sectionTitle}>Словник</Text>
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
          {wordCategories.map((category, index) => (
            <WordCard
              key={category.id}
              category={category}
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
    height: 180,
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
    height: 180,
    width: CARD_WIDTH,
    borderRadius: 20,
    padding: 20,
    justifyContent: "flex-start",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    gap: 8,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  description: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 16,
  },
  statsContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  statsText: {
    color: "rgba(255, 255, 255, 0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 22,
    paddingHorizontal: 20,
  },
});

export default WordsSwiper;
