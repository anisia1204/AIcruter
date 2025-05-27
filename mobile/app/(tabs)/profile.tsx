import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert, TextInput, ScrollView } from 'react-native';
import { useAuth } from '@/providers/AuthContext';
import { router } from 'expo-router';
import { apiGet, apiUpdate } from '@/lib/api';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm, Controller, useWatch } from 'react-hook-form';
import FormField from '@/components/atoms/InputFormField';
import MainView from '@/components/templates/MainView';
import { Loader } from '@/components/atoms/Loader';
import { getToken } from '@/lib/authToken';

const ProfileScreen = () => {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const { control, handleSubmit, setValue, getValues, reset } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      telephone: '',
      description: '',
      education: '',
      address: {
        country: '',
        state: '',
        city: '',
        addressLine: '',
        postalCode: '',
      },
    },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const userId = await AsyncStorage.getItem('userId');
        const data = await apiGet(`/api/applicant/${userId}`);
        setProfile(data);
        reset({
          firstName: data.userAccountDTO.firstName,
          lastName: data.userAccountDTO.lastName,
          email: data.userAccountDTO.email,
          telephone: data.userAccountDTO.telephone,
          description: data.description,
          education: data.education,
          address: {
            country: data.addressDTO?.country || '',
            state: data.addressDTO?.state || '',
            city: data.addressDTO?.city || '',
            addressLine: data.addressDTO?.addressLine || '',
            postalCode: data.addressDTO?.postalCode || '',
          },
        });
        setResumeName(data.resumeDTO?.name || null);
      } catch (e) {
        Toast.show({ type: 'error', text1: 'Failed to load profile' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [reset]);

  const onSave = async (formData: any) => {
    setSaving(true);
    try {
      const { email, ...userAccountDTOWithoutEmail } = profile.userAccountDTO || {};
      const payload = {
        ...profile,
        userAccountDTO: {
          ...userAccountDTOWithoutEmail,
          firstName: formData.firstName,
          lastName: formData.lastName,
          telephone: formData.telephone,
        },
        description: formData.description,
        education: formData.education,
        addressDTO: formData.address,
        postalCode: formData.postalCode,
      };
      await apiUpdate('/api/applicant', payload);
      Toast.show({ type: 'success', text1: 'Profile updated!' });
      setProfile(payload);
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async () => {
    setResumeUploading(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
        multiple: false
      });

      if (result.canceled) return;
      const file = result.assets[0];
      const formData = new FormData();
      formData.append('resume', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType || 'application/pdf',
      } as any);
      const token = await getToken();
      await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/applicant/resume`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          "ngrok-skip-browser-warning": "69420",
        },
        body: formData,
      });

      setResumeName(file.name);
      Toast.show({ type: 'success', text1: 'Resume updated!' });
    } catch (e) {
      Toast.show({ type: 'error', text1: 'Failed to upload resume' });
    } finally {
      setResumeUploading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Yes', onPress: () => {
          signOut();
          router.replace('../sign-in');
        }
      },
    ]);
  };

  if (loading) {
    return <MainView style={styles.scrollContent}><Loader /></MainView>;
  }

  const isAnyFieldEmpty = () => {
    const values = watchedValues;
    if (!values) return true;
    if (!values.firstName || !values.lastName || !values.email || !values.telephone || !values.description || !values.education) return true;
    const addr = values.address || {};
    if (!addr.country || !addr.state || !addr.city || !addr.addressLine || !addr.postalCode) return true;
    return false;
  };

  return (
    <MainView>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Profile Details</Text>
          </View>
        <Controller
            control={control}
            name="firstName"
            render={({ field: { onChange, value } }) => (
              <FormField label="First Name" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="lastName"
            render={({ field: { onChange, value } }) => (
              <FormField label="Last Name" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <FormField label="Email" value={value} onChangeText={onChange} keyboardType="email-address" autoCapitalize="none" editable={false} />
            )}
          />
          <Controller
            control={control}
            name="telephone"
            render={({ field: { onChange, value } }) => (
              <FormField label="Phone" value={value} onChangeText={onChange} keyboardType="phone-pad" />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <View style={styles.textAreaWrapper}>
                <Text style={styles.textAreaLabel}>Description</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  multiline
                  style={[styles.textArea, { maxHeight: 120 }]}
                  placeholder="Describe yourself..."
                  scrollEnabled={true}
                  textAlignVertical="top"
                />
              </View>
            )}
          />
          <Controller
            control={control}
            name="education"
            render={({ field: { onChange, value } }) => (
              <View style={styles.textAreaWrapper}>
                <Text style={styles.textAreaLabel}>Education</Text>
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  multiline
                  style={[styles.textArea, { maxHeight: 120 }]}
                  placeholder="Describe your education..."
                  scrollEnabled={true}
                  textAlignVertical="top"
                />
              </View>
            )}
          />
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Address</Text>
          </View>
          <Controller
            control={control}
            name="address.country"
            render={({ field: { onChange, value } }) => (
              <FormField label="Country" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="address.state"
            render={({ field: { onChange, value } }) => (
              <FormField label="State" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="address.city"
            render={({ field: { onChange, value } }) => (
              <FormField label="City" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="address.addressLine"
            render={({ field: { onChange, value } }) => (
              <FormField label="Address Line" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="address.postalCode"
            render={({ field: { onChange, value } }) => (
              <FormField label="Postal Code" value={value} onChangeText={onChange} />
            )}
          />
        </View>
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionHeader}>Resume</Text>
          </View>
          <View style={styles.resumeRow}>
            <View style={styles.resumeText}>
              <Text style={styles.resumeLabel}>Current:</Text>
              <Text style={styles.resumeName}>{resumeName ? resumeName : 'No resume uploaded'}</Text>
            </View>
            <TouchableOpacity style={styles.resumeBtn} onPress={handleResumeUpload} disabled={resumeUploading}>
              <Text style={styles.resumeBtnText}>{resumeUploading ? 'Uploading...' : 'Upload New'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.saveBtn,
            (saving || isAnyFieldEmpty())
              ? styles.saveBtnDisabled
              : styles.saveBtnEnabled
          ]}
          onPress={handleSubmit(onSave)}
          disabled={saving || isAnyFieldEmpty()}
        >
          <Text style={styles.saveBtnText}>{saving ? 'Updating...' : 'Update Profile'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutBtnText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </MainView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    minHeight: '100%',
  },
  sectionCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#3F51B5',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.10,
    shadowRadius: 14,
    elevation: 4,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#3F51B5',
    letterSpacing: 0.2,
  },
  textAreaWrapper: {
    marginBottom: 16,
  },
  textAreaLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 6,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  resumeRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  resumeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#444',
  },
  resumeName: {
    fontSize: 14,
    color: '#666',
  },
  resumeBtn: {
    backgroundColor: '#3F51B5',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  resumeBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  saveBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 8,
    width: '96%',
    maxWidth: 440,
    alignSelf: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 2,
  },
  saveBtnEnabled: {
    backgroundColor: '#3F51B5',
  },
  saveBtnDisabled: {
    backgroundColor: '#d1d5db',
  },
  signOutBtn: {
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
    width: '96%',
    maxWidth: 440,
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#3F51B5'
  },
  signOutBtnText: {
    color: '#3F51B5',
    fontSize: 16,
    fontWeight: '600',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resumeText: {
    flexDirection: "row",
    gap: 2,
    alignItems: 'center',
    marginBottom: 6,
  }
});

export default ProfileScreen;