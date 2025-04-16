import { Pressable, View } from "react-native";
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Svg, Path, Circle, G } from "react-native-svg";
import { useWindowDimensions } from "react-native";

export default function WelcomeLogo() {
  const { width, height } = useWindowDimensions();
  const logoWidth = width * 0.6;

  // Animation values
  const rotation = useSharedValue(0);
  const eyeScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotate: `${rotation.value}deg` },
        { translateX: translateX.value },
        { translateY: translateY.value },
        { scale: scale.value },
      ],
    };
  });

  // Handle press animation
  const handlePress = () => {
    // Define screen corners (with some padding)
    const corners = [
      { x: -width * 0.3, y: -height * 0.3 }, // Top-left
      { x: width * 0.3, y: -height * 0.3 }, // Top-right
      { x: -width * 0.3, y: height * 0.3 }, // Bottom-left
      { x: width * 0.3, y: height * 0.3 }, // Bottom-right
    ];

    // Randomly select 2-3 corners to bounce off
    const numBounces = Math.floor(Math.random() * 2) + 2; // 2 or 3 bounces
    const selectedCorners = corners
      .sort(() => Math.random() - 0.5)
      .slice(0, numBounces);

    // Create bounce sequence
    const bounceSequence = selectedCorners.map((corner, index) => {
      const isLastBounce = index === selectedCorners.length - 1;
      return withSequence(
        withSpring(corner.x, {
          damping: 12,
          stiffness: 100,
          mass: 0.8,
        }),
        withSpring(corner.y, {
          damping: 12,
          stiffness: 100,
          mass: 0.8,
        }),
        // Add a small pause at each corner
        withTiming(1, { duration: 100 }),
        // Return to center if it's the last bounce
        isLastBounce
          ? withSpring(0, {
              damping: 15,
              stiffness: 80,
              mass: 1,
            })
          : withTiming(0, { duration: 0 }),
      );
    });

    // Combine all animations
    const xSequence = withSequence(...bounceSequence.map((seq) => seq));
    const ySequence = withSequence(...bounceSequence.map((seq) => seq));

    // Apply animations
    translateX.value = xSequence;
    translateY.value = ySequence;

    // Add rotation based on movement direction
    rotation.value = withSequence(
      withSpring(360, { damping: 10, stiffness: 80 }),
      withSpring(0, { damping: 10, stiffness: 80 }),
    );

    // Scale animation
    scale.value = withSequence(
      withSpring(1.2, { damping: 10, stiffness: 80 }),
      withTiming(1, { duration: 800, easing: Easing.out(Easing.elastic(1)) }),
    );

    // Animate eyes
    eyeScale.value = withSequence(
      withTiming(1.2, { duration: 200, easing: Easing.ease }),
      withTiming(1, { duration: 200, easing: Easing.ease }),
    );
  };

  return (
    <View>
      <Pressable onPress={handlePress}>
        <Animated.View entering={FadeIn} style={animatedStyle}>
          <Svg
            width={logoWidth}
            height={logoWidth}
            viewBox="0 0 235 235"
            fill="none"
          >
            <Path
              d="M126.055 8.99192C121.652 3.54547 113.348 3.54547 108.945 8.99192L93.5804 27.9996C91.3423 30.7683 87.6824 31.9575 84.2444 31.0331L60.6413 24.6869C53.8781 22.8684 47.1603 27.7493 46.7998 34.7434L45.5416 59.1522C45.3584 62.7077 43.0964 65.821 39.7716 67.094L16.9462 75.8333C10.4058 78.3374 7.8398 86.2348 11.6592 92.105L24.9885 112.592C26.9301 115.576 26.9301 119.424 24.9885 122.408L11.6592 142.895C7.8398 148.765 10.4058 156.663 16.9462 159.167L39.7716 167.906C43.0964 169.179 45.3584 172.292 45.5416 175.848L46.7998 200.257C47.1603 207.251 53.8781 212.132 60.6413 210.313L84.2444 203.967C87.6824 203.043 91.3423 204.232 93.5804 207L108.945 226.008C113.348 231.455 121.652 231.455 126.055 226.008L141.42 207C143.658 204.232 147.318 203.043 150.756 203.967L174.359 210.313C181.122 212.132 187.84 207.251 188.2 200.257L189.458 175.848C189.642 172.292 191.904 169.179 195.228 167.906L218.054 159.167C224.594 156.663 227.16 148.765 223.341 142.895L210.011 122.408C208.07 119.424 208.07 115.576 210.011 112.592L223.341 92.105C227.16 86.2348 224.594 78.3374 218.054 75.8333L195.228 67.094C191.904 65.821 189.642 62.7077 189.458 59.1523L188.2 34.7434C187.84 27.7493 181.122 22.8684 174.359 24.6869L150.756 31.0331C147.318 31.9575 143.658 30.7683 141.42 27.9996L126.055 8.99192Z"
              fill="#FF603E"
              stroke="black"
              strokeWidth="2"
            />

            {/* Left Eye */}
            <G
              transform={`translate(91.5726, 102.606) scale(${eyeScale.value}) translate(-91.5726, -102.606)`}
            >
              <Circle
                cx="91.5726"
                cy="102.606"
                r="21.0657"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <Circle cx="82.1943" cy="103.157" r="9.37793" fill="#22211F" />
            </G>

            {/* Right Eye */}
            <G
              transform={`translate(144.531, 102.606) scale(${eyeScale.value}) translate(-144.531, -102.606)`}
            >
              <Circle
                cx="144.531"
                cy="102.606"
                r="21.0657"
                fill="white"
                stroke="black"
                strokeWidth="2"
              />
              <Circle cx="135.152" cy="103.157" r="9.37793" fill="#22211F" />
            </G>
          </Svg>
        </Animated.View>
      </Pressable>
    </View>
  );
}
