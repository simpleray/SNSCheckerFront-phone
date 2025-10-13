import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [text, setText] = useState('ここに分析したいテキストを入力');

  const onLogout = () =>
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });

  return (
    <View style={styles.root}>
      {/* 追加：ログアウトボタン */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
          <Text style={styles.logoutTxt}>ログアウト</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* ここから既存のUI（入力・分析ボタン・グラフ・結果・画像） 
        {/* 入力欄 */}
        <TextInput
          style={styles.input}
          multiline
          value={text}
          onChangeText={setText}
          placeholder="ここに分析したいテキストを入力"
          placeholderTextColor="#cfd8dc"
        />

        {/* 分析ボタン */}
        <TouchableOpacity style={styles.analyzeBtn} onPress={() => Alert.alert('分析', '表示のみ（ダミー）')}>
          <Text style={styles.analyzeText}>分析</Text>
        </TouchableOpacity>

        {/* 円グラフ2枚（画像差し替え） */}
        <View style={styles.graphRow}>
          <View style={styles.graphCard}>
            <Image source={require('../../assets/graph_direct.png')} style={styles.graphImg} resizeMode="contain" />
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={styles.detailText}>詳細表示</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.graphCard}>
            <Image source={require('../../assets/graph_indirect.png')} style={styles.graphImg} resizeMode="contain" />
            <TouchableOpacity style={styles.detailBtn}>
              <Text style={styles.detailText}>詳細表示</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 結果テキスト枠（静的） */}
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>
            「わたしのチェックだよ。今の投稿には名前や住所、メール、電話、来年の予定など個人的な情報が多く見つかったから注意が必要だよ。
            でも大丈夫。公開範囲を見直したり、不必要な部分は伏せ字にしよう。」
          </Text>
        </View>

        {/* マスコット */}
        <Image source={require('../../assets/mascot.png')} style={styles.mascot} resizeMode="contain" />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root:{ flex:1, backgroundColor:'#2196F3' },
  topBar:{ paddingTop:12, paddingHorizontal:12, backgroundColor:'#2196F3' },
  logoutBtn:{ alignSelf:'flex-end', backgroundColor:'#0D47A1', paddingVertical:8, paddingHorizontal:14, borderRadius:8 },
  logoutTxt:{ color:'#fff', fontWeight:'bold' },
  container:{ padding:16, gap:16 },
  input: {
    minHeight: 140,
    borderRadius: 8,
    backgroundColor: '#ffffff',
    padding: 12,
    fontSize: 14,
  },
  analyzeBtn: {
    alignSelf: 'flex-end',
    backgroundColor: '#0D47A1',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  analyzeText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  graphRow: { flexDirection: 'row', gap: 12 },
  graphCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 12,
  },
  graphImg: { width: 120, height: 120 },
  detailBtn: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f0f4ff',
    borderRadius: 6,
  },
  detailText: { color: '#1E88E5', fontWeight: '600' },
  resultBox: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12 },
  resultText: { color: '#333', lineHeight: 20, fontSize: 14 },
  mascot: { width: '60%', height: 160, alignSelf: 'center' },
});
