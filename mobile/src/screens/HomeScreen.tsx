import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import BottomNavBar from '../components/BottomNavBar';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.avatar}>
                <Ionicons name="person-outline" size={24} color="#BDBDBD" />
              </View>

              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>hola, Atleta</Text>
                <Text style={styles.headerSubtitle}>¿Qué haremos hoy?</Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <Ionicons name="menu" size={28} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                <Ionicons name="notifications-outline" size={26} color="#FFFFFF" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </View>
          </View>

          {/* NOTICIAS */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Noticias</Text>

            <TouchableOpacity style={styles.newsCard} activeOpacity={0.85}>
              <View style={styles.newsIconContainer}>
                <Ionicons name="newspaper-outline" size={42} color="#E5E5E5" />
              </View>

              <View style={styles.newsContent}>
                <Text style={styles.newsTitle}>
                  Campeonato Nacional de Taekwondo 2026
                </Text>
                <Text style={styles.newsDescription}>
                  Próximas fechas y categorías disponibles para inscripción.
                </Text>
                <Text style={styles.newsDate}>Abril 2026</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* PROGRESO */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Progreso</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeMore}>Ver más</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.progressCard}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>7.3</Text>
                  <Text style={styles.statLabel}>Último score</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statValue}>12</Text>
                  <Text style={styles.statLabel}>Análisis</Text>
                </View>

                <View style={styles.statDivider} />

                <View style={styles.statItem}>
                  <Text style={styles.statValue}>98%</Text>
                  <Text style={styles.statLabel}>Detección</Text>
                </View>
              </View>

              <TouchableOpacity style={styles.analysisButton} activeOpacity={0.85}>
                <Ionicons name="scan-outline" size={22} color="#FFFFFF" />
                <Text style={styles.analysisButtonText}>Nuevo análisis</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* CALENDARIO */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Calendario</Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.seeMore}>Ver más</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.calendarCard}>
              <TouchableOpacity style={styles.eventItem} activeOpacity={0.8}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateDay}>15</Text>
                  <Text style={styles.dateMonth}>ABR</Text>
                </View>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>Entrenamiento Poomsae</Text>
                  <Text style={styles.eventSubtitle}>Club Kundo Kwang · 18:00</Text>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
              </TouchableOpacity>

              <View style={styles.eventDivider} />

              <TouchableOpacity style={styles.eventItem} activeOpacity={0.8}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateDay}>20</Text>
                  <Text style={styles.dateMonth}>ABR</Text>
                </View>

                <View style={styles.eventInfo}>
                  <Text style={styles.eventTitle}>Torneo Regional</Text>
                  <Text style={styles.eventSubtitle}>Coliseo Municipal · 09:00</Text>
                </View>

                <Ionicons name="chevron-forward" size={24} color="#BDBDBD" />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <BottomNavBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  scrollContent: {
    paddingTop: 6,
    paddingHorizontal: 18,
    paddingBottom: 20,
  },

  header: {
    width: '100%',
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 26,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#232323',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flexShrink: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'none',
  },
  headerSubtitle: {
    color: '#9A9A9A',
    fontSize: 14,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#E93735',
  },

  section: {
    marginBottom: 26,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  seeMore: {
    color: '#E93735',
    fontSize: 14,
    fontWeight: '600',
  },

  newsCard: {
    width: '100%',
    backgroundColor: '#1F1F1F',
    borderRadius: 22,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  newsIconContainer: {
    width: 110,
    minHeight: 150,
    backgroundColor: '#2A2A2A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  newsContent: {
    flex: 1,
    paddingVertical: 22,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  newsTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
    marginBottom: 10,
  },
  newsDescription: {
    color: '#C6C6C6',
    fontSize: 13.5,
    lineHeight: 21,
    marginBottom: 16,
  },
  newsDate: {
    color: '#E93735',
    fontSize: 13,
    fontWeight: '700',
  },

  progressCard: {
    width: '100%',
    backgroundColor: '#1F1F1F',
    borderRadius: 22,
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 22,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    height: 54,
    backgroundColor: '#343434',
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 6,
  },
  statLabel: {
    color: '#B8B8B8',
    fontSize: 13,
    textAlign: 'center',
  },
  analysisButton: {
    height: 58,
    borderRadius: 16,
    backgroundColor: '#E93735',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analysisButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },

  calendarCard: {
    width: '100%',
    backgroundColor: '#1F1F1F',
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  eventItem: {
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateBox: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#E93735',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  dateDay: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 22,
  },
  dateMonth: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 10,
  },
  eventTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  eventSubtitle: {
    color: '#B8B8B8',
    fontSize: 13.5,
  },
  eventDivider: {
    height: 1,
    backgroundColor: '#2F2F2F',
    marginLeft: 72,
  },
});