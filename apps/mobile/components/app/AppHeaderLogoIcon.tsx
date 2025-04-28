import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import Logo from "../icons/Logo";

export default function AppHeaderLogoIcon({
  courseId,
}: {
  courseId: number | undefined;
}) {
  return (
    <View style={styles.icon}>
      <View style={styles.icon_hero_wrapper}>
        {courseId === 0 && (
          <Svg viewBox="0 0 235 235" fill="none">
            <Path
              d="M141.42 27.943L126.055 8.93528C121.652 3.48882 113.348 3.48882 108.945 8.93528L93.5804 27.943C91.3423 30.7117 87.6824 31.9008 84.2444 30.9764L60.6413 24.6302C53.8781 22.8118 47.1603 27.6926 46.7998 34.6867L45.5416 59.0956C45.3584 62.6511 43.0964 65.7643 39.7716 67.0373L16.9462 75.7766C10.4058 78.2808 7.8398 86.1781 11.6592 92.0484L24.9885 112.535C26.9301 115.519 26.9301 119.367 24.9885 122.352L11.6592 142.838C7.8398 148.709 10.4058 156.606 16.9462 159.11L39.7716 167.849C43.0964 169.122 45.3584 172.236 45.5416 175.791L46.7998 200.2C47.1603 207.194 53.8781 212.075 60.6413 210.256L84.2444 203.91C87.6824 202.986 91.3423 204.175 93.5804 206.944L108.945 225.951C113.348 231.398 121.652 231.398 126.055 225.951L141.42 206.944C143.658 204.175 147.318 202.986 150.756 203.91L174.359 210.256C181.122 212.075 187.84 207.194 188.2 200.2L189.458 175.791C189.642 172.236 191.904 169.122 195.228 167.849L218.054 159.11C224.594 156.606 227.16 148.709 223.341 142.838L210.012 122.352C208.07 119.367 208.07 115.519 210.012 112.535L223.341 92.0484C227.16 86.1781 224.594 78.2808 218.054 75.7766L195.228 67.0373C191.904 65.7643 189.642 62.6511 189.458 59.0956L188.2 34.6867C187.84 27.6926 181.122 22.8118 174.359 24.6302L150.756 30.9764C147.318 31.9008 143.658 30.7117 141.42 27.943Z"
              fill="transparent"
              stroke="#121512"
              strokeWidth="2"
            />
            <Circle
              cx="144.533"
              cy="102.549"
              r="21.0657"
              fill="white"
              stroke="#121512"
              strokeWidth="2"
            />
            <Circle
              cx="91.5735"
              cy="102.549"
              r="21.0657"
              fill="white"
              stroke="#121512"
              strokeWidth="2"
            />
            <Circle cx="135.153" cy="103.1" r="9.37793" fill="#121512" />
            <Circle cx="82.1963" cy="103.1" r="9.37793" fill="#121512" />
          </Svg>
        )}
        {courseId && (
          <View style={styles.icon_hero}>
            <Logo course={"A1"} rotation={0} size={0.12} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
    padding: 2,
    position: "relative",
    backgroundColor: "white",
    borderRadius: 15,
    shadowColor: "#000",
    overflow: "hidden",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  icon_hero_wrapper: {
    position: "absolute",
    right: -11,
    width: 50,
    height: 50,
    bottom: -17,
  },
  icon_hero: {
    position: "absolute",
    right: 0,
    bottom: 0,
  },
});
