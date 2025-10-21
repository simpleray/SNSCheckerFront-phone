// HomeScreen.tsx（全面リファクタ版）
import React, { useMemo, useState } from 'react'
import {
  View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert, SafeAreaView, Dimensions
} from 'react-native'
import Svg, { Circle } from 'react-native-svg'

type ResponseType = {
  detail: string
  direct_percent: number
  indirect_percent: number
}

/* 実APIを使うときはこの実装に切替
async function fetchAnalyze(text: string): Promise<ResponseType> {
  const res = await fetch('https://snscheckerback-phone.onrender.com/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('API通信エラー')
  return (await res.json()) as ResponseType
}
*/

// デモ用ダミー
async function fetchAnalyze(text: string): Promise<ResponseType> {
  const paragraphs = [
    '分析結果サンプルA：この文章は感情の直接的な指標が高めです。運用時は文脈の確認を推奨します。',
    '分析結果サンプルB：間接的な要素が目立ちます。追加のコンテキストを確認してください。',
    '分析結果サンプルC：バランスは良好です。引き続き観察を継続してください。',
  ]
  const direct = Math.floor(Math.random() * 101)
  const indirect = Math.floor(Math.random() * 101)
  const detail = paragraphs[Math.floor(Math.random() * paragraphs.length)]
  return new Promise((resolve) =>
    setTimeout(() => resolve({ detail, direct_percent: direct, indirect_percent: indirect }), 400)
  )
}

function Ring({
  label, value, size = 160, stroke = 14, onPress,
}: { label: string; value: number; size?: number; stroke?: number; onPress?: () => void }) {
  const r = (size - stroke) / 2
  const C = 2 * Math.PI * r
  const v = Math.max(0, Math.min(100, value))
  const dash = (C * v) / 100

  return (
    <Pressable onPress={onPress} style={styles.ringPressable} android_ripple={{ color:'#e3f2fd', radius: size/2 }}>
      <View style={{ width:size, height:size }}>
        <Svg width={size} height={size}>
          <Circle cx={size/2} cy={size/2} r={r} stroke="#E0E0E0" strokeWidth={stroke} fill="none" />
          <Circle
            cx={size/2} cy={size/2} r={r}
            stroke={`hsl(${240 - v * 2.4},100%,50%)`}
            strokeWidth={stroke}
            strokeDasharray={`${dash} ${C - dash}`}
            strokeLinecap="round" fill="none"
            transform={`rotate(-90 ${size/2} ${size/2})`}
          />
        </Svg>
        <View style={styles.ringCenterWrap}>
          <Text style={styles.ringLabel}>{label}</Text>
          <Text style={styles.percentage}>{v}%</Text>
          <Text style={styles.ringDetail}>タップで詳細</Text>
        </View>
      </View>
    </Pressable>
  )
}

export default function HomeScreen() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ResponseType | null>(null)
  const [loading, setLoading] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const maxPercent = useMemo(
    () => (result ? Math.max(result.direct_percent, result.indirect_percent) : 0),
    [result]
  )
  const score: 'good'|'normal'|'bad' = maxPercent < 30 ? 'good' : maxPercent < 60 ? 'normal' : 'bad'

  const onAnalyze = async () => {
    if (!text.trim()) { Alert.alert('入力エラー', 'テキストを入力してください'); return }
    setLoading(true); setShowDetail(false)
    try { setResult(await fetchAnalyze(text)) }
    catch { Alert.alert('エラー', '分析に失敗しました') }
    finally { setLoading(false) }
  }

  const clearAll = () => { setText(''); setResult(null); setShowDetail(false) }

  const width = Dimensions.get('window').width
  const contentWidth = Math.min(width - 24, 720)

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#1976D2' }}>
      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios' ? 'padding' : undefined}>
        <View style={styles.topBar}>
          <Text style={styles.topTitle}>分析</Text>
          <Pressable onPress={clearAll} style={styles.topClear} android_ripple={{ color:'#0d47a1' }}>
            <Text style={styles.topClearText}>リセット</Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={[styles.container, { width: contentWidth, alignSelf:'center' }]}>
          <View style={styles.card}>
            <Text style={styles.label}>ここに分析したいテキストを入力</Text>
            <TextInput
              style={styles.input}
              multiline
              value={text}
              onChangeText={setText}
              placeholder="ここに分析したいテキストを入力"
              placeholderTextColor="#9e9e9e"
              textAlignVertical="top"
              accessibilityLabel="入力テキスト"
            />
            <Pressable
              onPress={onAnalyze}
              disabled={loading}
              style={({ pressed }) => [styles.primaryBtn, { opacity: loading ? 0.6 : pressed ? 0.9 : 1 }]}
              android_ripple={{ color:'#e3f2fd' }}
              accessibilityRole="button"
              accessibilityLabel="分析を実行"
            >
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.primaryBtnText}>分析</Text>}
            </Pressable>
          </View>

          {result && (
            <View style={styles.card}>
              <Text style={styles.sectionTitle}>スコア</Text>

              <View style={styles.ringsRow}>
                <View style={styles.ringCard}>
                  <Ring label="直接" value={result.direct_percent} onPress={() => setShowDetail(v=>!v)} />
                </View>
                <View style={styles.ringCard}>
                  <Ring label="間接" value={result.indirect_percent} onPress={() => setShowDetail(v=>!v)} />
                </View>
              </View>

              {showDetail && (
                <View style={styles.detailBox}>
                  <Text style={styles.detailText}>{result.detail}</Text>
                </View>
              )}

              <View style={styles.characterWrap}>
                {score==='good'   && <Image source={require('../../assets/good.png')}   style={styles.character} resizeMode="contain" />}
                {score==='normal' && <Image source={require('../../assets/normal.png')} style={styles.character} resizeMode="contain" />}
                {score==='bad'    && <Image source={require('../../assets/bad.png')}    style={styles.character} resizeMode="contain" />}
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  // レイアウト
  container: { padding: 12, paddingBottom: 24 },
  topBar: {
    height: 52, backgroundColor:'#1976D2',
    flexDirection:'row', alignItems:'center', justifyContent:'space-between',
    paddingHorizontal:12
  },
  topTitle: { color:'#E3F2FD', fontSize:20, fontWeight:'bold' },
  topClear: { paddingHorizontal:12, paddingVertical:6, backgroundColor:'#0F6CBD', borderRadius:6 },
  topClearText: { color:'#fff', fontSize:14 },

  // カード
  card: {
    backgroundColor:'#FFFFFF', borderRadius:12, padding:12,
    shadowColor:'#000', shadowOpacity:0.08, shadowRadius:8, shadowOffset:{ width:0, height:3 },
    elevation:2, marginTop:12
  },

  // 入力
  label: { color:'#455A64', marginBottom:8 },
  input: {
    minHeight:120, borderWidth:1, borderColor:'#CFD8DC', borderRadius:8,
    padding:10, fontSize:16, color:'#212121', backgroundColor:'#FAFAFA'
  },
  primaryBtn: {
    marginTop:12, backgroundColor:'#005490', borderRadius:8,
    paddingVertical:12, alignItems:'center', justifyContent:'center'
  },
  primaryBtnText: { color:'#fff', fontSize:18, fontWeight:'600' },

  // リング
  ringsRow: { flexDirection:'row', justifyContent:'space-between', gap:12, marginTop:8 },
  ringCard: {
    flex:1, alignItems:'center', justifyContent:'center',
    paddingVertical:8, backgroundColor:'#F7FAFF', borderRadius:12, borderWidth:1, borderColor:'#E3F2FD'
  },
  ringPressable: { alignItems:'center', justifyContent:'center' },
  ringCenterWrap: {
    position:'absolute', top:0, left:0, right:0, bottom:0,
    alignItems:'center', justifyContent:'center'
  },
  ringLabel: { fontWeight:'bold', color:'#546E7A', marginBottom:2 },
  percentage: { fontSize:26, fontWeight:'bold', color:'#263238' },
  ringDetail: { color:'#78909C', marginTop:2, fontSize:12 },

  // 詳細
  detailBox: {
    marginTop:12, padding:12, backgroundColor:'#E3F2FD',
    borderRadius:10, borderWidth:1, borderColor:'#BBDEFB'
  },
  detailText: { color:'#37474F', fontSize:16, lineHeight:22 }, // クリップ回避：maxHeight等は不使用

  // キャラクター
  characterWrap:{ alignItems:'center', marginTop:8 },
  character:{ width:200, height:200 },
    sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 6,
  },
})
