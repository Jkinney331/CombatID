import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../src/store/auth';

const mockProfile = {
  combatId: 'DOEJ123456',
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  phone: '+1 123-456-7890',
  dateOfBirth: '01/15/1995',
  countryOfBirth: 'United States',
  currentResidence: 'Seattle, WA',
  weightClass: 'Welterweight',
  disciplines: ['MMA', 'Kickboxing', 'Muay Thai'],
  licenses: [
    { state: 'Utah', status: 'Active', expires: '12/31/2025' },
    { state: 'Idaho', status: 'Active', expires: '06/30/2026' },
  ],
  record: '3-0',
  gym: 'ATT',
  verificationStatus: 'verified',
};

function ProfileSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {mockProfile.name.split(' ').map((n) => n[0]).join('')}
            </Text>
          </View>
          <Text style={styles.name}>{mockProfile.name}</Text>
          <View style={styles.combatIdRow}>
            <Text style={styles.combatId}>{mockProfile.combatId}</Text>
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockProfile.record}</Text>
              <Text style={styles.statLabel}>Record</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockProfile.disciplines.length}</Text>
              <Text style={styles.statLabel}>Disciplines</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{mockProfile.licenses.length}</Text>
              <Text style={styles.statLabel}>Licenses</Text>
            </View>
          </View>
        </View>

        {/* Personal Info */}
        <ProfileSection title="Personal Information">
          <ProfileRow label="Email" value={mockProfile.email} />
          <ProfileRow label="Phone" value={mockProfile.phone} />
          <ProfileRow label="Date of Birth" value={mockProfile.dateOfBirth} />
          <ProfileRow label="Country of Birth" value={mockProfile.countryOfBirth} />
          <ProfileRow label="Current Residence" value={mockProfile.currentResidence} />
        </ProfileSection>

        {/* Fighter Info */}
        <ProfileSection title="Fighter Information">
          <ProfileRow label="Weight Class" value={mockProfile.weightClass} />
          <ProfileRow label="Current Gym" value={mockProfile.gym} />
          <ProfileRow label="Disciplines" value={mockProfile.disciplines.join(', ')} />
        </ProfileSection>

        {/* Licenses */}
        <ProfileSection title="Active Licenses">
          {mockProfile.licenses.map((license, i) => (
            <View key={i} style={styles.licenseCard}>
              <View style={styles.licenseInfo}>
                <Text style={styles.licenseName}>{license.state}</Text>
                <Text style={styles.licenseExpiry}>Expires: {license.expires}</Text>
              </View>
              <View style={styles.licenseStatus}>
                <Text style={styles.licenseStatusText}>{license.status}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Add License</Text>
          </TouchableOpacity>
        </ProfileSection>

        {/* Settings */}
        <ProfileSection title="Settings">
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Edit Profile</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Privacy Settings</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Notification Preferences</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Security</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Help & Support</Text>
            <Text style={styles.menuItemArrow}>›</Text>
          </TouchableOpacity>
        </ProfileSection>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Sign Out</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.version}>CombatID v0.1.0</Text>
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
  header: {
    backgroundColor: '#2563EB',
    paddingVertical: 32,
    alignItems: 'center',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  combatIdRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  combatId: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  verifiedText: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stat: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  rowLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  rowValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  licenseCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  licenseInfo: {
    flex: 1,
  },
  licenseName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  licenseExpiry: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  licenseStatus: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  licenseStatusText: {
    fontSize: 12,
    color: '#166534',
    fontWeight: '500',
  },
  addButton: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemText: {
    fontSize: 14,
    color: '#111827',
  },
  menuItemArrow: {
    fontSize: 20,
    color: '#9CA3AF',
  },
  logoutButton: {
    marginHorizontal: 16,
    marginTop: 24,
    backgroundColor: '#fff',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  logoutButtonText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
  version: {
    textAlign: 'center',
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 24,
    marginBottom: 32,
  },
});
