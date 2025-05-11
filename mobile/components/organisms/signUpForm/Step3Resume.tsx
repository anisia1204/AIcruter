import { View, Text, Pressable } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import TextAreaFormField from '@/components/atoms/TextAreaFormField';
import * as DocumentPicker from 'expo-document-picker';
import { StyledButton } from '@/components/atoms/StyledButton';

export const Step3Resume = () => {
 const { control } = useFormContext();
  return (
    <View>
    
  <Controller
    name="resume.resumeFile"
    control={control}
    render={({ field, fieldState }) => (
      <View style={{ marginVertical: 16 }}>
        <StyledButton
          label={field.value?.name || "Upload Resume"}
          onPress={async () => {
            const result = await DocumentPicker.getDocumentAsync({
              type: '*/*',
              copyToCacheDirectory: true,
              multiple: false
            });

            if (result.assets && result.assets.length > 0) {
              const file = result.assets[0];
              field.onChange({
                uri: file.uri,
                name: file.name,
                size: file.size,
                mimeType: file.mimeType,
              });
            }
          }}
        />

        {field.value?.name && (
          <View style={{ marginTop: 8 }}>
            <Text>Uploaded: {field.value.name}</Text>
            <Pressable onPress={() => field.onChange(undefined)}>
              <Text style={{ color: 'red', marginTop: 4 }}>Remove File</Text>
            </Pressable>
          </View>
        )}

        {fieldState.error && (
          <Text style={{ color: 'red', marginTop: 8 }}>
            {fieldState.error.message}
          </Text>
        )}
      </View>
    )}
  />

      <Controller
        name="resume.description"
        control={control}
        render={({ field, fieldState }) => (
          <TextAreaFormField
            label="Description"
            placeholder="Description..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
      <Controller
        name="resume.education"
        control={control}
        render={({ field, fieldState }) => (
          <TextAreaFormField
            label="Education"
            placeholder="Education..."
            value={field.value}
            onChangeText={field.onChange}
            error={fieldState.error?.message}
          />
        )}
      />
    </View>
  );
};
