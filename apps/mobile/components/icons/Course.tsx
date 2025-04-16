import Svg, { SvgProps, Text, TSpan } from "react-native-svg";

export default function Course({ course }: { course: string }) {
  return (
    <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      {/* Stroke layer */}
      <Text
        fill="none"
        stroke="#000"
        strokeWidth={1.5}
        fontSize={20}
        fontWeight="bold"
        fontFamily="Chevy"
        x="12"
        y="14"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        <TSpan>{course}</TSpan>
      </Text>
      {/* Fill layer */}
      <Text
        fill="#fff"
        fontSize={20}
        fontWeight="bold"
        fontFamily="Chevy"
        x="12"
        y="14"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        <TSpan>{course}</TSpan>
      </Text>
    </Svg>
  );
}
