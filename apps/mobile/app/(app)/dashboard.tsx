import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';

// Mock data - will be replaced with API calls
const mockFighter = {
  combatId: 'DOEJ123456',
  name: 'John Doe',
  record: '3-0',
  gym: 'ATT',
  country: 'USA',
  status: 'Ready To Fight',
  disciplines: ['Pro MMA', 'Pro Kickboxing', 'Muay Thai'],
  licenses: ['Utah', 'Idaho'],
  lastResult: 'Winner by KO',
  nextBout: 'TBD',
};

const mockMedicals = [
  { type: 'Blood Work', date: '11/5/2025', status: 'valid', expiresIn: 45 },
  { type: 'Physical', date: '2/4/2025', status: 'valid', expiresIn: 120 },
  { type: 'Eye Exam', date: '8/5/2023', status: 'expired', expiresIn: -30 },
  { type: 'Radiology', date: '1/2/2024', status: 'expiring', expiresIn: 15 },
  { type: 'EKG', date: '4/1', status: 'valid', expiresIn: 200 },
];

const mockRecentUploads = [
  { type: 'Blood Test', provider: 'Dr. Adam Fine', date: '11/3/2025', status: 'Negative' },
  { type: 'Drug Test', provider: 'Drug Free Sport', date: '11/1/2025', status: 'Negative' },
  { type: 'Infectious Disease Panel', provider: 'Drug Free Sport', date: '10/10/2026', status: 'Negative' },
];

function StatusBadge({ status }: { status: string }) {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'ready to fight':
        return { bg: '#DCFCE7', text: '#166534' };
      case 'medical suspension':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'ineligible':
        return { bg: '#FEE2E2', text: '#DC2626' };
      case 'able to train':
        return { bg: '#FEF3C7', text: '#D97706' };
      default:
        return { bg: '#F3F4F6', text: '#374151' };
    }
  };

  const colors = getStatusColor();
  return (
    <View style={[styles.statusBadge, { backgroundColor: colors.bg }]}>
      <Text style={[styles.statusText, { color: colors.text }]}>{status}</Text>
    </View>
  );
}

function MedicalCard({ medical }: { medical: typeof mockMedicals[0] }) {
  const getStatusColor = () => {
    if (medical.status === 'expired') return '#EF4444';
    if (medical.status === 'expiring') return '#F59E0B';
    return '#10B981';
  };

  return (
    <View style={styles.medicalCard}>
      <View style={[styles.medicalIndicator, { backgroundColor: getStatusColor() }]} />
      <Text style={styles.medicalType}>{medical.type}</Text>
      <Text style={styles.medicalDate}>{medical.date}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: Fetch fresh data from API
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Commission Badge */}
        <View style={styles.commissionBadge}>
          <Text style={styles.commissionText}>COMMISSION</Text>
        </View>

        {/* Fighter Header */}
        <View style={styles.fighterHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {mockFighter.name.split(' ').map(n => n[0]).join('')}
              </Text>
            </View>
          </View>

          <View style={styles.fighterInfo}>
            <View style={styles.fighterIdRow}>
              <Text style={styles.combatId}>{mockFighter.combatId}</Text>
              <View style={styles.promotionBadge}>
                <Text style={styles.promotionText}>UFC</Text>
              </View>
            </View>
            <View style={styles.fighterMeta}>
              <Text style={styles.record}>{mockFighter.record}</Text>
              <Text style={styles.metaSeparator}>|</Text>
              <Text style={styles.gym}>{mockFighter.gym}</Text>
              <Text style={styles.metaSeparator}>|</Text>
              <Text style={styles.country}>{mockFighter.country}</Text>
            </View>
            <StatusBadge status={mockFighter.status} />
          </View>
        </View>

        {/* Disciplines */}
        <View style={styles.disciplinesRow}>
          {mockFighter.disciplines.map((d, i) => (
            <View key={i} style={styles.disciplineBadge}>
              <Text style={styles.disciplineText}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Licenses & Result */}
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>LICENSES: </Text>
          <Text style={styles.infoValue}>{mockFighter.licenses.join(', ')}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>RESULT: </Text>
          <Text style={styles.infoValue}>{mockFighter.lastResult}</Text>
        </View>
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>NEXT BOUT: </Text>
          <Text style={styles.infoValue}>{mockFighter.nextBout}</Text>
        </View>

        {/* Medical Overview */}
        <Text style={styles.sectionTitle}>Medical Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.medicalsScroll}>
          {mockMedicals.map((m, i) => (
            <MedicalCard key={i} medical={m} />
          ))}
        </ScrollView>

        {/* Recent Uploads */}
        <Text style={styles.sectionTitle}>Recent Uploads</Text>
        <View style={styles.uploadsTable}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Type</Text>
            <Text style={[styles.tableHeaderText, { flex: 2 }]}>Administered</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Date</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Status</Text>
          </View>
          {mockRecentUploads.map((upload, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 2 }]}>{upload.type}</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>{upload.provider}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{upload.date}</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>{upload.status}</Text>
            </View>
          ))}
        </View>

        {/* Upload Button */}
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => router.push('/(app)/documents')}
        >
          <Text style={styles.uploadButtonText}>Upload New Document</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollView: {
    flex: 1,
  },
  commissionBadge: {
    backgroundColor: '#1E3A5F',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  commissionText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    letterSpacing: 1,
  },
  fighterHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
  },
  fighterInfo: {
    flex: 1,
  },
  fighterIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  combatId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginRight: 8,
  },
  promotionBadge: {
    backgroundColor: '#111827',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  promotionText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  fighterMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  record: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  metaSeparator: {
    marginHorizontal: 8,
    color: '#9CA3AF',
  },
  gym: {
    fontSize: 14,
    color: '#6B7280',
  },
  country: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  disciplinesRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
  },
  disciplineBadge: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  disciplineText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  infoSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  infoValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12,
  },
  medicalsScroll: {
    paddingLeft: 16,
  },
  medicalCard: {
    width: 80,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medicalIndicator: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 8,
  },
  medicalType: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 4,
  },
  medicalDate: {
    fontSize: 10,
    color: '#6B7280',
  },
  uploadsTable: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tableHeaderText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableCell: {
    fontSize: 11,
    color: '#374151',
  },
  uploadButton: {
    backgroundColor: '#2563EB',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
