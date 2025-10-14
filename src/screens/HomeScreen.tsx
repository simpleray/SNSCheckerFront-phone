// HomeScreen.tsx（スタイルと該当箇所のみ差し替え版）
import React, { useMemo, useState } from 'react'
import {
  View, Text, TextInput, Pressable, StyleSheet, Image, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert
} from 'react-native'
import Svg, { Circle } from 'react-native-svg'

type ResponseType = {
  detail: string
  direct_percent: number
  indirect_percent: number
}

async function fetchAnalyze(text: string): Promise<ResponseType> {
  const res = await fetch('http://localhost:8080/analyze', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error('API通信エラー')
  return (await res.json()) as ResponseType
}

function Ring({
  label, value, size = 150, stroke = 16, onPress,
}: { label: string; value: number; size?: number; stroke?: number; onPress?: () => void }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(100, value))
  const dash = (circumference * clamped) / 100

  return (
    <Pressable onPress={onPress} style={{ alignItems: 'center' }}>
      <Svg width={size} height={size}>
        <Circle cx={size/2} cy={size/2} r={radius} stroke="#E0E0E0" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size/2} cy={size/2} r={radius}
          stroke={`hsl(${240 - clamped * 2.4},100%,50%)`}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round" fill="none"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </Svg>
      <View style={styles.ringCenter}>
        <Text style={styles.ringLabel}>{label}</Text>
        <Text style={styles.percentage}>{clamped}%</Text>
        <Text style={styles.ringDetail}>詳細表示</Text>
      </View>
    </Pressable>
  )
}

export default function HomeScreen() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ResponseType | null>(null)
  const [loading, setLoading] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const maxPercent = useMemo(() => result ? Math.max(result.direct_percent, result.indirect_percent) : 0, [result])
  const score: 'good'|'normal'|'bad' = maxPercent < 30 ? 'good' : maxPercent < 60 ? 'normal' : 'bad'

  const onAnalyze = async () => {
    if (!text.trim()) { Alert.alert('入力エラー', 'テキストを入力してください'); return }
    setLoading(true); setShowDetail(false)
    try { setResult(await fetchAnalyze(text)) }
    catch { Alert.alert('エラー', '分析に失敗しました') }
    finally { setLoading(false) }
  }

  return (
    <KeyboardAvoidingView style={{ flex:1, backgroundColor:'#2196F3' }}
      behavior={Platform.OS==='ios' ? 'padding' : undefined}>
      <View style={styles.topBar}>
        <Pressable onPress={() => { setText(''); setResult(null); setShowDetail(false) }} style={styles.sideAnalyseButton}>
          <Text style={{ color:'#fff', fontSize:21 }}>分析</Text>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.app}>
        <Text style={styles.appP}>ここに分析したいテキストを入力</Text>
        <TextInput
          style={styles.textarea}
          multiline value={text} onChangeText={setText}
          placeholder="ここに分析したいテキストを入力" placeholderTextColor="#9e9e9e"
        />
        <Pressable onPress={onAnalyze} disabled={loading} style={({pressed})=>[
          styles.sideAnalyseButton,
          { alignSelf:'flex-start', marginLeft:230, opacity: loading?0.6: pressed?0.85:1 }
        ]}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={{ color:'#fff', fontSize:21 }}>分析</Text>}
        </Pressable>

        {result && (
          <View style={styles.sideAnalyzeApp}>
            <View style={styles.side}>
              <View style={styles.direct}>
                <View style={styles.circle}>
                  <Ring label="直接" value={result.direct_percent} onPress={()=>setShowDetail(v=>!v)} />
                </View>
              </View>
              <View style={styles.indirect}>
                <View style={styles.circle}>
                  <Ring label="間接" value={result.indirect_percent} onPress={()=>setShowDetail(v=>!v)} />
                </View>
              </View>
            </View>

            {showDetail && (
              <View style={styles.balloon1}>
                <Text style={styles.balloonText}>{result.detail}</Text>
                <View style={styles.balloonTail} />
              </View>
            )}

            <View style={{ alignItems:'center' }}>
              {score==='good'   && <Image source={require('../../assets/good.png')}   style={styles.character} resizeMode="contain" />}
              {score==='normal' && <Image source={require('../../assets/normal.png')} style={styles.character} resizeMode="contain" />}
              {score==='bad'    && <Image source={require('../../assets/bad.png')}    style={styles.character} resizeMode="contain" />}
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  // .app
  app: { paddingBottom: 24 },
  appP: {
    marginTop: 20, marginLeft: 10, marginBottom: 0, fontSize: 16, color: '#fff',
  },
  textarea: {
    minHeight: 100, minWidth: 300, marginTop: 5, marginLeft: 5,
    backgroundColor:'#fff', borderRadius:8, padding:10, fontSize:16,
  },
  sideAnalyseButton: {
    backgroundColor: '#005490',
    borderRadius: 4, paddingVertical: 5, paddingHorizontal: 10,
  },

  // .sideAnalyze-app
  sideAnalyzeApp: {
    position: 'relative', // stickyの代替：必要なら親を固定配置に
    top: 0, zIndex: 9999,
    marginTop: 10, padding: 10,
    backgroundColor: 'rgba(255,255,255,0.25)', // backdrop-filter代替
    borderRadius: 8,
  },

  // .side
  side: { flexDirection: 'row', gap: 10 },

  // .direct / .indirect
  direct: {}, indirect: {},

  // .circle
  circle: {
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 130/2, height: 130, width: 130,
    alignSelf: 'center',
  },

  // 中央テキスト
  ringCenter: {
    position: 'absolute', top: '50%', left: '50%', width: 120,
    transform: [{ translateX: -60 }, { translateY: -60 }],
    alignItems: 'center', justifyContent: 'center',
  },
  ringLabel: { fontWeight: 'bold', color: '#717678', marginBottom: 2 },
  percentage: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  ringDetail: { color: '#717678', marginTop: 4, fontSize: 12 },

  // .character
  character: { width: 200, height: 200 },

  // .balloon1 と疑似要素の置換
  balloon1: {
    alignSelf:'flex-start',
    marginTop: 16, marginBottom: 16,
    paddingVertical: 7, paddingHorizontal: 10,
    minWidth: 120, maxWidth: '100%',
    backgroundColor: '#e0edff', borderRadius: 10,
  },
  balloonText: { color:'#555', fontSize:16, maxHeight: '20%', },
  balloonTail: {
    position:'absolute', top: '100%', left:'50%',
    marginLeft: -15, width: 0, height: 0,
    borderLeftWidth:15, borderRightWidth:15, borderTopWidth:15,
    borderLeftColor:'transparent', borderRightColor:'transparent', borderTopColor:'#e0edff',
  },

  // ヘッダ
  topBar:{ paddingTop:12, paddingHorizontal:12, backgroundColor:'#2196F3' },
})
