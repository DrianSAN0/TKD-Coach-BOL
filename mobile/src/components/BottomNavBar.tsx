import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type NavProp = NativeStackNavigationProp<RootStackParamList>;

const TABS = [
  { name: 'Home',           icon: 'home-outline',    iconActive: 'home'     },
  { name: 'ScannerInicial', icon: 'scan-outline',    iconActive: 'scan'     },
  { name: 'Ranking',        icon: 'trophy-outline',  iconActive: 'trophy'   },
  { name: 'Calendar',       icon: 'calendar-outline',iconActive: 'calendar' },
] as const;

export default function BottomNavBar() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute();

  const getIsActive = (tabName: string) => {
    if (route.name === tabName) return true;
    if (tabName === 'Ranking' && (route.name === 'RankingTabla' || route.name === 'RankingPesos')) return true;
    if (tabName === 'ScannerInicial' && route.name === 'UploadVideo') return true;
    return false;
  };

  return (
    <View style={s.container}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.name}
          style={s.tab}
          onPress={() => navigation.navigate(tab.name as any)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={getIsActive(tab.name) ? tab.iconActive : tab.icon}
            size={28}
            color={getIsActive(tab.name) ? '#E93735' : '#666666'}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
    height: 62,
    paddingBottom: 6,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});