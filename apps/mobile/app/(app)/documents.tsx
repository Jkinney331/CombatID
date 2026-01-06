import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

const DOCUMENT_TYPES = [
  { id: 'blood_test', label: 'Blood Test', icon: '🩸' },
  { id: 'physical', label: 'Physical Exam', icon: '🩺' },
  { id: 'eye_exam', label: 'Eye Exam', icon: '👁️' },
  { id: 'mri', label: 'MRI/CT Scan', icon: '🧠' },
  { id: 'ekg', label: 'EKG', icon: '❤️' },
  { id: 'drug_test', label: 'Drug Test', icon: '🧪' },
  { id: 'license', label: 'License/ID', icon: '🪪' },
  { id: 'insurance', label: 'Insurance', icon: '📋' },
  { id: 'other', label: 'Other', icon: '📄' },
];

const mockDocuments = [
  {
    id: '1',
    type: 'blood_test',
    name: 'Blood Panel - Quest Diagnostics',
    uploadDate: '2025-11-03',
    expirationDate: '2026-05-03',
    status: 'verified',
    provider: 'Dr. Adam Fine',
  },
  {
    id: '2',
    type: 'physical',
    name: 'Annual Physical Examination',
    uploadDate: '2025-02-04',
    expirationDate: '2026-02-04',
    status: 'verified',
    provider: 'Sports Medicine Clinic',
  },
  {
    id: '3',
    type: 'eye_exam',
    name: 'Ophthalmology Report',
    uploadDate: '2023-08-05',
    expirationDate: '2024-08-05',
    status: 'expired',
    provider: 'Eye Care Associates',
  },
  {
    id: '4',
    type: 'drug_test',
    name: 'Anti-Doping Panel',
    uploadDate: '2025-11-01',
    expirationDate: '2026-02-01',
    status: 'verified',
    provider: 'Drug Free Sport',
  },
];

function DocumentCard({ document }: { document: typeof mockDocuments[0] }) {
  const getStatusStyle = () => {
    switch (document.status) {
      case 'verified':
        return { bg: '#DCFCE7', text: '#166534', label: 'Verified' };
      case 'pending':
        return { bg: '#FEF3C7', text: '#D97706', label: 'Pending Review' };
      case 'expired':
        return { bg: '#FEE2E2', text: '#DC2626', label: 'Expired' };
      default:
        return { bg: '#F3F4F6', text: '#374151', label: document.status };
    }
  };

  const status = getStatusStyle();
  const docType = DOCUMENT_TYPES.find((t) => t.id === document.type);

  return (
    <TouchableOpacity style={styles.documentCard}>
      <View style={styles.documentIcon}>
        <Text style={styles.documentEmoji}>{docType?.icon || '📄'}</Text>
      </View>
      <View style={styles.documentInfo}>
        <Text style={styles.documentName} numberOfLines={1}>
          {document.name}
        </Text>
        <Text style={styles.documentProvider}>{document.provider}</Text>
        <View style={styles.documentMeta}>
          <Text style={styles.documentDate}>
            Expires: {document.expirationDate}
          </Text>
          <View style={[styles.documentStatus, { backgroundColor: status.bg }]}>
            <Text style={[styles.documentStatusText, { color: status.text }]}>
              {status.label}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function DocumentsScreen() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showTypeSelector, setShowTypeSelector] = useState(false);

  const pickImage = async () => {
    if (!selectedType) {
      setShowTypeSelector(true);
      return;
    }

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Camera access is needed to scan documents.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      handleUpload(result.assets[0].uri, 'image');
    }
  };

  const pickDocument = async () => {
    if (!selectedType) {
      setShowTypeSelector(true);
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        handleUpload(result.assets[0].uri, 'document');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleUpload = async (uri: string, type: 'image' | 'document') => {
    setIsUploading(true);
    try {
      // TODO: Upload to backend
      // The backend will:
      // 1. Store in S3
      // 2. Send to AI service for OCR/classification
      // 3. Extract metadata
      // 4. Update fighter profile
      await new Promise((resolve) => setTimeout(resolve, 2000));
      Alert.alert(
        'Upload Complete',
        'Your document has been uploaded and is being processed. You will be notified once verification is complete.'
      );
      setSelectedType(null);
    } catch (err) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView}>
        {/* Upload Section */}
        <View style={styles.uploadSection}>
          <Text style={styles.sectionTitle}>Upload New Document</Text>

          {/* Document Type Selector */}
          <TouchableOpacity
            style={styles.typeSelector}
            onPress={() => setShowTypeSelector(!showTypeSelector)}
          >
            <Text style={selectedType ? styles.typeSelectorText : styles.typeSelectorPlaceholder}>
              {selectedType
                ? DOCUMENT_TYPES.find((t) => t.id === selectedType)?.label
                : 'Select Document Type'}
            </Text>
          </TouchableOpacity>

          {showTypeSelector && (
            <View style={styles.typeList}>
              {DOCUMENT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeItem,
                    selectedType === type.id && styles.typeItemSelected,
                  ]}
                  onPress={() => {
                    setSelectedType(type.id);
                    setShowTypeSelector(false);
                  }}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.typeLabel,
                      selectedType === type.id && styles.typeLabelSelected,
                    ]}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Upload Buttons */}
          <View style={styles.uploadButtons}>
            <TouchableOpacity
              style={[styles.uploadButton, !selectedType && styles.uploadButtonDisabled]}
              onPress={pickImage}
              disabled={isUploading}
            >
              <Text style={styles.uploadButtonIcon}>📷</Text>
              <Text style={styles.uploadButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.uploadButton, !selectedType && styles.uploadButtonDisabled]}
              onPress={pickDocument}
              disabled={isUploading}
            >
              <Text style={styles.uploadButtonIcon}>📁</Text>
              <Text style={styles.uploadButtonText}>Choose File</Text>
            </TouchableOpacity>
          </View>

          {isUploading && (
            <View style={styles.uploadingIndicator}>
              <ActivityIndicator color="#2563EB" />
              <Text style={styles.uploadingText}>Uploading document...</Text>
            </View>
          )}
        </View>

        {/* Documents List */}
        <View style={styles.documentsSection}>
          <Text style={styles.sectionTitle}>Your Documents</Text>

          {/* Filter Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterTabs}
          >
            <TouchableOpacity style={[styles.filterTab, styles.filterTabActive]}>
              <Text style={[styles.filterTabText, styles.filterTabTextActive]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterTab}>
              <Text style={styles.filterTabText}>Medical</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterTab}>
              <Text style={styles.filterTabText}>Licenses</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterTab}>
              <Text style={styles.filterTabText}>Expired</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Document Cards */}
          {mockDocuments.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </View>
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
  uploadSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  typeSelector: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#F9FAFB',
    marginBottom: 12,
  },
  typeSelectorText: {
    fontSize: 16,
    color: '#111827',
  },
  typeSelectorPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  typeList: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  typeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  typeItemSelected: {
    backgroundColor: '#EBF5FF',
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  typeLabel: {
    fontSize: 16,
    color: '#374151',
  },
  typeLabelSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonDisabled: {
    backgroundColor: '#93C5FD',
  },
  uploadButtonIcon: {
    fontSize: 18,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  uploadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    gap: 8,
  },
  uploadingText: {
    color: '#2563EB',
    fontSize: 14,
  },
  documentsSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  filterTabs: {
    marginBottom: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#fff',
  },
  documentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  documentEmoji: {
    fontSize: 24,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  documentProvider: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  documentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentDate: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  documentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  documentStatusText: {
    fontSize: 10,
    fontWeight: '600',
  },
});
