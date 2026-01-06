import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const WEIGHT_CLASSES = [
  'Strawweight',
  'Flyweight',
  'Bantamweight',
  'Featherweight',
  'Lightweight',
  'Welterweight',
  'Middleweight',
  'Light Heavyweight',
  'Heavyweight',
];

const DISCIPLINES = [
  'MMA',
  'Boxing',
  'Muay Thai',
  'Kickboxing',
  'BJJ',
  'Wrestling',
  'Judo',
  'Karate',
  'Taekwondo',
];

const profileSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  countryOfBirth: z.string().min(1, 'Country of birth is required'),
  currentResidence: z.string().min(1, 'Current residence is required'),
  weightClass: z.string().min(1, 'Weight class is required'),
  disciplines: z.array(z.string()).min(1, 'Select at least one discipline'),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showWeightClassPicker, setShowWeightClassPicker] = useState(false);
  const [showDisciplinePicker, setShowDisciplinePicker] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      dateOfBirth: '',
      countryOfBirth: '',
      currentResidence: '',
      weightClass: '',
      disciplines: [],
    },
  });

  const selectedDisciplines = watch('disciplines');
  const selectedWeightClass = watch('weightClass');

  const onSubmit = async (data: ProfileForm) => {
    setIsLoading(true);
    try {
      // TODO: Save profile to backend
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.replace('/(app)/dashboard');
    } catch (err) {
      console.error('Profile setup failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDiscipline = (discipline: string) => {
    const current = selectedDisciplines || [];
    if (current.includes(discipline)) {
      setValue('disciplines', current.filter((d) => d !== discipline));
    } else {
      setValue('disciplines', [...current, discipline]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Progress Indicator */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressDot, styles.progressDotCompleted]} />
            <View style={[styles.progressLine, styles.progressLineCompleted]} />
            <View style={[styles.progressDot, styles.progressDotCompleted]} />
            <View style={[styles.progressLine, styles.progressLineCompleted]} />
            <View style={[styles.progressDot, styles.progressDotActive]} />
          </View>

          <Text style={styles.title}>Please Verify Your Data</Text>
          <Text style={styles.subtitle}>
            This information will be used for your CombatID profile
          </Text>

          <View style={styles.form}>
            {/* Name */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NAME</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.name && styles.inputError]}
                    placeholder="John Doe"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.name && (
                <Text style={styles.fieldError}>{errors.name.message}</Text>
              )}
            </View>

            {/* Date of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DATE OF BIRTH</Text>
              <Controller
                control={control}
                name="dateOfBirth"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.dateOfBirth && styles.inputError]}
                    placeholder="01/01/9999"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numbers-and-punctuation"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.dateOfBirth && (
                <Text style={styles.fieldError}>{errors.dateOfBirth.message}</Text>
              )}
            </View>

            {/* Country of Birth */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>COUNTRY OF BIRTH</Text>
              <Controller
                control={control}
                name="countryOfBirth"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.countryOfBirth && styles.inputError]}
                    placeholder="United States of America"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.countryOfBirth && (
                <Text style={styles.fieldError}>{errors.countryOfBirth.message}</Text>
              )}
            </View>

            {/* Current Residence */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CURRENT RESIDENCE</Text>
              <Controller
                control={control}
                name="currentResidence"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors.currentResidence && styles.inputError]}
                    placeholder="Seattle, WA"
                    placeholderTextColor="#9CA3AF"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.currentResidence && (
                <Text style={styles.fieldError}>{errors.currentResidence.message}</Text>
              )}
            </View>

            {/* Weight Class */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>WEIGHTCLASS</Text>
              <TouchableOpacity
                style={[styles.input, styles.selectInput, errors.weightClass && styles.inputError]}
                onPress={() => setShowWeightClassPicker(!showWeightClassPicker)}
              >
                <Text style={selectedWeightClass ? styles.selectText : styles.selectPlaceholder}>
                  {selectedWeightClass || 'Choose from Dropdown'}
                </Text>
              </TouchableOpacity>
              {showWeightClassPicker && (
                <View style={styles.pickerContainer}>
                  {WEIGHT_CLASSES.map((wc) => (
                    <TouchableOpacity
                      key={wc}
                      style={[
                        styles.pickerItem,
                        selectedWeightClass === wc && styles.pickerItemSelected,
                      ]}
                      onPress={() => {
                        setValue('weightClass', wc);
                        setShowWeightClassPicker(false);
                      }}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedWeightClass === wc && styles.pickerItemTextSelected,
                        ]}
                      >
                        {wc}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.weightClass && (
                <Text style={styles.fieldError}>{errors.weightClass.message}</Text>
              )}
            </View>

            {/* Disciplines */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>DISCIPLINES</Text>
              <TouchableOpacity
                style={[styles.input, styles.selectInput, errors.disciplines && styles.inputError]}
                onPress={() => setShowDisciplinePicker(!showDisciplinePicker)}
              >
                <Text style={selectedDisciplines?.length ? styles.selectText : styles.selectPlaceholder}>
                  {selectedDisciplines?.length
                    ? selectedDisciplines.join(', ')
                    : 'Select From Dropdown'}
                </Text>
              </TouchableOpacity>
              {showDisciplinePicker && (
                <View style={styles.pickerContainer}>
                  {DISCIPLINES.map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[
                        styles.pickerItem,
                        selectedDisciplines?.includes(d) && styles.pickerItemSelected,
                      ]}
                      onPress={() => toggleDiscipline(d)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          selectedDisciplines?.includes(d) && styles.pickerItemTextSelected,
                        ]}
                      >
                        {selectedDisciplines?.includes(d) ? '✓ ' : ''}{d}
                      </Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => setShowDisciplinePicker(false)}
                  >
                    <Text style={styles.doneButtonText}>Done</Text>
                  </TouchableOpacity>
                </View>
              )}
              {errors.disciplines && (
                <Text style={styles.fieldError}>{errors.disciplines.message}</Text>
              )}
            </View>

            {/* Licenses (placeholder) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>LICENSES</Text>
              <TouchableOpacity style={[styles.input, styles.selectInput]}>
                <Text style={styles.selectPlaceholder}>Select From Dropdown</Text>
              </TouchableOpacity>
              <Text style={styles.helperText}>
                You can add licenses later from your profile
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Next</Text>
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
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
  progressDotCompleted: {
    backgroundColor: '#10B981',
  },
  progressLine: {
    width: 60,
    height: 2,
    backgroundColor: '#D1D5DB',
  },
  progressLineCompleted: {
    backgroundColor: '#10B981',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  selectInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: '#111827',
  },
  selectPlaceholder: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  inputError: {
    borderColor: '#DC2626',
  },
  fieldError: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
  },
  helperText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerItemSelected: {
    backgroundColor: '#EBF5FF',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#374151',
  },
  pickerItemTextSelected: {
    color: '#2563EB',
    fontWeight: '600',
  },
  doneButton: {
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
  },
  doneButtonText: {
    color: '#2563EB',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
