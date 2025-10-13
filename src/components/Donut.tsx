import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

export default function Donut({ size=140, strokeWidth=16, percent=0, color='#2D9CDB', bgColor='#E6E6E6', label='' }:{
  size?:number; strokeWidth?:number; percent?:number; color?:string; bgColor?:string; label?:string;
}) {
  const radius = (size - strokeWidth) / 2;
  const C = 2 * Math.PI * radius;
  const p = Math.max(0, Math.min(100, percent));
  return (
    <View style={{ alignItems:'center' }}>
      <Svg width={size} height={size}>
        <G rotation="-90" originX={size/2} originY={size/2}>
          <Circle cx={size/2} cy={size/2} r={radius} stroke={bgColor} strokeWidth={strokeWidth} fill="transparent" />
          <Circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round" strokeDasharray={`${C} ${C}`} strokeDashoffset={C*(1-p/100)} fill="transparent" />
        </G>
      </Svg>
      <View style={styles.center}>
        <Text style={styles.percent}>{p}%</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  center:{ position:'absolute', top:0,bottom:0,left:0,right:0, alignItems:'center', justifyContent:'center' },
  percent:{ fontSize:22, fontWeight:'bold', color:'#333' },
  label:{ fontSize:12, color:'#666', marginTop:2 }
});