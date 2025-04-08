import { useRef, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { courseColors } from "@/constants/Colors";
import A1 from "@/components/icons/A1";
type FilterType = "level" | "topic";

const SLIDER_BUTTONS_LEVEL = [
  {
    icon: "all",
    value: "Всі",
  },
  {
    icon: "A1",
    value: "Початковий",
  },
  {
    icon: "A2",
    value: "Середній",
  },
  {
    icon: "B1",
    value: "Достатній",
  },
  {
    icon: "B2",
    value: "Високий",
  },
];

const SLIDER_BUTTONS_TOPIC = [
  {
    icon: "all",
    value: "Всі",
  },
  {
    icon: "Modal verbs1",
    value: "Модальні дієслова",
  },
  {
    icon: "Modal verbs3",
    value: "Модальні дієслова",
  },
  {
    icon: "Modal verbs14",
    value: "Модальні дієслова",
  },
  {
    icon: "Modal verbs1r5",
    value: "Модальні дієслова",
  },
];

export function GrammarHeader() {
  const { top } = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerHeight, setHeaderHeight] = useState(0);
  const [activeFilter, setActiveFilter] = useState<FilterType>("level");
  const [selectedLevel, setSelectedLevel] = useState("A1");
  const slideAnim = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  const handleFilterPress = (filter: FilterType) => {
    Animated.spring(slideAnim, {
      toValue: filter === "level" ? 0 : 1,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
    setActiveFilter(filter);
  };

  const slidePosition = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, containerWidth / 2],
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          paddingTop: top,
        },
      ]}
      onLayout={(event) => {
        setHeaderHeight(event.nativeEvent.layout.height);
      }}
    >
      <Text style={styles.title}>Граматика</Text>
      <View
        style={styles.filterContainer}
        onLayout={(event) => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}
      >
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => handleFilterPress("level")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "level" && styles.filterButtonTextActive,
              ]}
            >
              За рівнем
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => handleFilterPress("topic")}
          >
            <Text
              style={[
                styles.filterButtonText,
                activeFilter === "topic" && styles.filterButtonTextActive,
              ]}
            >
              За темою
            </Text>
          </TouchableOpacity>
        </View>
        <Animated.View
          style={[
            styles.filterIndicator,
            {
              transform: [{ translateX: slidePosition }],
            },
          ]}
        />
      </View>
      <View style={styles.filterIndicatorContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sliderContainer}
        >
          {activeFilter === "level"
            ? SLIDER_BUTTONS_LEVEL.map((level) => (
                <TouchableOpacity
                  key={level.icon}
                  style={[
                    styles.sliderButton,
                    selectedLevel === level.icon && styles.sliderButtonActive,
                    selectedLevel === "all" && styles.sliderButtonActive,
                    {
                      backgroundColor:
                        selectedLevel === level.icon || selectedLevel === "all"
                          ? courseColors[
                              selectedLevel as keyof typeof courseColors
                            ].background
                          : "transparent",
                    },
                  ]}
                  onPress={() => setSelectedLevel(level.icon)}
                >
                  <A1 style={{ width: 24, height: 24 }} />
                  <Text style={styles.sliderButtonValue}>{level.value}</Text>
                </TouchableOpacity>
              ))
            : SLIDER_BUTTONS_TOPIC.map((topic) => (
                <TouchableOpacity key={topic.icon} style={styles.sliderButton}>
                  <Text style={styles.sliderButtonText}>{topic.icon}</Text>
                </TouchableOpacity>
              ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
    color: "#111",
    marginTop: 10,
    marginBottom: 15,
  },
  header: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  filterContainer: {
    position: "relative",
    marginHorizontal: 20,
    marginBottom: 10,
    height: 35,
  },
  filterButtons: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 18,
    height: "100%",
  },
  filterButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#666",
  },
  filterButtonTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  filterIndicator: {
    position: "absolute",
    top: 0,
    right: 4,
    height: 35,
    left: 0,
    bottom: 4,
    width: "50%",
    backgroundColor: "#111111",
    borderRadius: 20,
    zIndex: 0,
  },
  filterIndicatorContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 10,
  },
  sliderContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  sliderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#f5f5f5",
  },
  sliderButtonActive: {
    backgroundColor: "#111111",
  },
  sliderButtonText: {
    fontSize: 14,
    color: "#666",
  },
  sliderButtonTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  sliderButtonValue: {
    fontSize: 12,
    color: "#666",
  },
});
