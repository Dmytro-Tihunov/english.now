import { courseColors } from "@/constants/Colors";
import { StyleSheet } from "react-native";


export const GrammarGroupButton = () => {
  return <View style={styles.button}>
    <Text style={styles.buttonText}>{title}</Text>
  </View>
  );
};


const styles = StyleSheet.create({
  button: {
    backgroundColor: courseColors.B1.background,
  },
});
