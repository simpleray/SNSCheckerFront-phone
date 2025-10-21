import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const onLogin = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Home' }] });

  return (
    <View style={styles.c}>
      <TouchableOpacity style={styles.btn} onPress={onLogin}>
        <Image source={require('../../assets/splash-icon.png')} style={{ width: 100, height: 100, marginBottom: 20 }} />
        <Text style={styles.txt}>ログイン</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  c:{ flex:1, alignItems:'center', justifyContent:'center', backgroundColor:'#fff' },
  btn:{ backgroundColor:'#1E88E5', paddingVertical:12, paddingHorizontal:20, borderRadius:8 },
  txt:{ color:'#fff', fontWeight:'bold' },
});
