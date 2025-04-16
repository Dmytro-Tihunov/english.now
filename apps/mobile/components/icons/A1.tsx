import * as React from "react";
import Svg, { SvgProps, Text, TSpan } from "react-native-svg";
const A1 = (props: SvgProps) => (
  <Svg fill="none" {...props}>
    {/* <Path
      stroke={props.color ?? "#222"}
      strokeWidth={1.0}
      fill={props.color ?? "#fff"}
      d="M11.102 11H6.914v-.422h1.11l-1.172-3h-3.11l-1.125 3h.875c.063 0 .12.005.172.016.135.02.203.156.203.406H.992v-.422h1l3.422-8.953H6.57l3.688 8.953h.469a.87.87 0 0 1 .171.016c.136.02.204.156.204.406ZM6.664 7.11l-1.39-3.594L3.93 7.109h2.734Zm8.078-4.548h1.297v7.891l1.25.14a.46.46 0 0 1 .11.016c.25.042.374.172.374.391h-5.812v-.406l1.984-.14V3.75l-2.25 1.36-.28-.438 3.327-2.11Z"
    /> */}
    <Text
      fill={props.color ?? "#fff"}
      stroke={props.color ?? "#222"}
      strokeWidth={1.0}
      fontSize={22}
      fontWeight="bold"
      x="10"
      y={16}
      textAnchor="start"
    >
      <TSpan>A1</TSpan>
    </Text>
  </Svg>
);
export default A1;
