import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Mock sponsorship data
const mockSponsorships = [
  {
    id: '1',
    company: 'Celsius',
    logo: '🥤',
    title: 'Need Leads for a Commercial Shoot',
    compensation: '$5,000 per Shoot',
    type: 'commercial',
  },
  {
    id: '2',
    company: "The Farmer's Dog",
    logo: '🐕',
    title: 'Brand Ambassador',
    compensation: 'Compensation Varies per Social Media',
    type: 'ambassador',
  },
  {
    id: '3',
    company: 'Lee Johnson Auto Family',
    logo: '🚗',
    title: 'Auto Partner',
    compensation: '$2,000 per Shoot',
    type: 'partnership',
  },
  {
    id: '4',
    company: 'Elysian Brewing',
    logo: '🍺',
    title: 'Beer Ambassador',
    compensation: '$100 per Post',
    type: 'ambassador',
  },
  {
    id: '5',
    company: 'Sanabul',
    logo: '🥊',
    title: 'Content Creator',
    compensation: 'Compensation Varies per Social Media',
    type: 'content',
  },
  {
    id: '6',
    company: 'T-Mobile',
    logo: '📱',
    title: 'MMA Fighters Needed for Commercial',
    compensation: '$10,000 per Shoot',
    type: 'commercial',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '🔥' },
  { id: 'commercial', label: 'Commercial', icon: '🎬' },
  { id: 'ambassador', label: 'Ambassador', icon: '🌟' },
  { id: 'content', label: 'Content', icon: '📱' },
  { id: 'partnership', label: 'Partnership', icon: '🤝' },
];

function SponsorshipCard({ sponsorship }: { sponsorship: typeof mockSponsorships[0] }) {
  return (
    <TouchableOpacity style={styles.sponsorshipCard}>
      <View style={styles.sponsorLogo}>
        <Text style={styles.sponsorLogoText}>{sponsorship.logo}</Text>
      </View>
      <View style={styles.sponsorshipInfo}>
        <Text style={styles.sponsorshipTitle}>{sponsorship.title}</Text>
        <Text style={styles.sponsorCompany}>{sponsorship.company}</Text>
        <Text style={styles.sponsorshipCompensation}>{sponsorship.compensation}</Text>
      </View>
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>View</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSponsorships = mockSponsorships.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || s.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sponsorship Marketplace</Text>
          <Text style={styles.headerSubtitle}>
            Find opportunities from brands, gyms, and promotions
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search opportunities..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Featured Brands */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.featuredBrands}
        >
          {['Sanabul', 'Celsius', 'Bud Light', 'T-Mobile'].map((brand, i) => (
            <TouchableOpacity key={i} style={styles.featuredBrand}>
              <View style={styles.featuredBrandLogo}>
                <Text style={styles.featuredBrandText}>{brand[0]}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === cat.id && styles.categoryLabelActive,
                ]}
              >
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sponsorship List */}
        <View style={styles.sponsorshipList}>
          {filteredSponsorships.map((s) => (
            <SponsorshipCard key={s.id} sponsorship={s} />
          ))}
        </View>

        {filteredSponsorships.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No opportunities found</Text>
            <Text style={styles.emptyStateSubtext}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
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
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111827',
  },
  featuredBrands: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  featuredBrand: {
    marginRight: 12,
  },
  featuredBrandLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  featuredBrandText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
  },
  categories: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  categoryLabelActive: {
    color: '#fff',
  },
  sponsorshipList: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sponsorshipCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sponsorLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sponsorLogoText: {
    fontSize: 24,
  },
  sponsorshipInfo: {
    flex: 1,
  },
  sponsorshipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  sponsorCompany: {
    fontSize: 13,
    color: '#2563EB',
    marginBottom: 2,
  },
  sponsorshipCompensation: {
    fontSize: 12,
    color: '#6B7280',
  },
  applyButton: {
    backgroundColor: '#EBF5FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6B7280',
  },
});
