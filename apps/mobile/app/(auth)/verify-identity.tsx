import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

type UploadType = 'government_id' | 'business_license';

export default function VerifyIdentityScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<{
    government_id?: { uri: string; name: string };
    business_license?: { uri: string; name: string };
  }>({});
  const [accountType, setAccountType] = useState<'fighter' | 'business'>('fighter');

  const pickImage = async (type: UploadType) => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Camera access is needed to scan your documents.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setUploadedFiles((prev) => ({
        ...prev,
        [type]: {
          uri: result.assets[0].uri,
          name: `${type}_${Date.now()}.jpg`,
        },
      }));
    }
  };

  const pickDocument = async (type: UploadType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setUploadedFiles((prev) => ({
          ...prev,
          [type]: {
            uri: result.assets[0].uri,
            name: result.assets[0].name,
          },
        }));
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to pick document. Please try again.');
    }
  };

  const handleUpload = async () => {
    const requiredDoc = accountType === 'fighter' ? 'government_id' : 'business_license';

    if (!uploadedFiles[requiredDoc]) {
      Alert.alert('Document Required', 'Please upload the required document to continue.');
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Upload to backend and trigger Stripe Identity verification
      // For now, simulate upload delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      router.push('/(auth)/profile-setup');
    } catch (err) {
      Alert.alert('Error', 'Failed to upload document. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderUploadSection = (type: UploadType, title: string, description: string) => {
    const uploaded = uploadedFiles[type];

    return (
      <View style={styles.uploadSection}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>CombatID</Text>
          <Text style={styles.logoSubtext}>THE GLOBAL FIGHTER IDENTITY{'\n'}& HEALTH NETWORK</Text>
        </View>

        <Text style={styles.uploadDescription}>{description}</Text>

        {uploaded ? (
          <View style={styles.uploadedIndicator}>
            <Text style={styles.uploadedText}>✓ {uploaded.name}</Text>
            <TouchableOpacity onPress={() => setUploadedFiles((prev) => ({ ...prev, [type]: undefined }))}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => pickImage(type)}
            >
              <Text style={styles.optionButtonText}>Image</Text>
              <Text style={styles.optionSubtext}>Opens camera for users{'\n'}to take the required photos</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => pickDocument(type)}
            >
              <Text style={styles.optionButtonText}>PDF</Text>
              <Text style={styles.optionSubtext}>Opens PDF upload screen{'\n'}for users to upload the required PDFs</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={[styles.uploadButton, !uploaded && styles.uploadButtonDisabled]}
          onPress={handleUpload}
          disabled={!uploaded || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>Upload</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Type Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, accountType === 'fighter' && styles.toggleButtonActive]}
            onPress={() => setAccountType('fighter')}
          >
            <Text style={[styles.toggleText, accountType === 'fighter' && styles.toggleTextActive]}>
              Fighter
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, accountType === 'business' && styles.toggleButtonActive]}
            onPress={() => setAccountType('business')}
          >
            <Text style={[styles.toggleText, accountType === 'business' && styles.toggleTextActive]}>
              Business
            </Text>
          </TouchableOpacity>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressDot, styles.progressDotActive]} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
          <View style={styles.progressLine} />
          <View style={styles.progressDot} />
        </View>

        {accountType === 'fighter' ? (
          renderUploadSection(
            'government_id',
            'Government ID',
            'Upload an image or PDF of a Government issued ID to create your CombatID'
          )
        ) : (
          renderUploadSection(
            'business_license',
            'Business License',
            'Upload an image or PDF of proof of a licensed business to create your CombatID'
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  toggleButtonActive: {
    backgroundColor: '#2563EB',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  toggleTextActive: {
    color: '#fff',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#D1D5DB',
  },
  progressDotActive: {
    backgroundColor: '#2563EB',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#D1D5DB',
  },
  uploadSection: {
    flex: 1,
    alignItems: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EBF5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#2563EB',
  },
  logoText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: 'bold',
  },
  logoSubtext: {
    color: '#2563EB',
    fontSize: 6,
    textAlign: 'center',
    marginTop: 2,
  },
  uploadDescription: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  optionButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563EB',
    marginBottom: 8,
  },
  optionSubtext: {
    fontSize: 10,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
  uploadedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 32,
    gap: 16,
  },
  uploadedText: {
    color: '#059669',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  removeText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '500',
  },
  uploadButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
