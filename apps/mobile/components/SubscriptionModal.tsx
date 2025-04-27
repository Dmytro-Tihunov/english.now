import React, { useRef, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Dimensions,
} from "react-native";
// If you have react-native-linear-gradient, uncomment the next line and use LinearGradient below
// import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get("window");

const features = [
  { icon: "∞", text: "Unlimited stories" },
  { icon: "⬇️", text: "Download in 4K" },
  { icon: "🚫", text: "Remove Rally branding" },
  { icon: "📊", text: "Advanced analytics" },
];

const SubscriptionModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const shineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      const shineAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(shineAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(shineAnim, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );
      shineAnimation.start();
      return () => shineAnimation.stop();
    }
  }, [visible, shineAnim]);

  return (
    <Modal visible={visible} animationType="fade" transparent={true}>
      <View style={styles.overlay}>
        {/* Replace View with LinearGradient for a real gradient if available */}
        <View style={styles.gradientBg}>
          <Animated.View
            style={[
              styles.shine,
              {
                transform: [
                  {
                    translateX: shineAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-width * 0.5, width * 0.5],
                    }),
                  },
                ],
              },
            ]}
          />
          <View style={styles.crownWrap}>
            <Text style={styles.crown}>👑</Text>
          </View>
          <Text style={styles.title}>
            Tell better stories with{" "}
            <Text style={{ color: "#B8860B" }}>Super</Text>
          </Text>
          <View style={styles.featureList}>
            {features.map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{f.icon}</Text>
                <Text style={styles.featureText}>{f.text}</Text>
              </View>
            ))}
          </View>
          <Pressable style={styles.upgradeBtn} onPress={onClose}>
            <Text style={styles.upgradeBtnText}>Upgrade to Super</Text>
          </Pressable>
          <Pressable style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  gradientBg: {
    width: width * 0.9,
    minHeight: height * 0.7,
    backgroundColor: "gold", // Replace with LinearGradient for real effect
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    position: "relative",
  },
  shine: {
    position: "absolute",
    width: 120,
    height: "120%",
    backgroundColor: "rgba(255,255,255,0.25)",
    top: -20,
    left: 0,
    borderRadius: 60,
    transform: [{ skewX: "-20deg" }],
    zIndex: 1,
  },
  crownWrap: {
    marginBottom: 16,
    marginTop: 8,
    zIndex: 2,
  },
  crown: {
    fontSize: 48,
    textAlign: "center",
    textShadowColor: "#fff8",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#7c5700",
    marginBottom: 24,
    textAlign: "center",
    zIndex: 2,
  },
  featureList: {
    width: "100%",
    marginBottom: 32,
    zIndex: 2,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: "#7c5700",
  },
  upgradeBtn: {
    backgroundColor: "#111",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
    zIndex: 2,
  },
  upgradeBtnText: {
    color: "#FFD700",
    fontWeight: "bold",
    fontSize: 18,
  },
  closeBtn: {
    marginTop: 8,
    zIndex: 2,
  },
  closeBtnText: {
    color: "#7c5700",
    fontSize: 16,
    textAlign: "center",
  },
});

export default SubscriptionModal;
