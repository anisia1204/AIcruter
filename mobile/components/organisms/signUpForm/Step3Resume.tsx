import { Button, View, Text } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import TextAreaFormField from '@/components/atoms/TextAreaFormField';
import * as DocumentPicker from 'expo-document-picker';

export const Step3Resume = () => {
 const { control } = useFormContext();

  return (
    <View>
    <Controller
      name="resume"
      control={control}
      render={({ field }) => (
        <View style={{ marginVertical: 10 }}>
          <Button
            title={field.value?.name || "Upload Resume"}
            onPress={async () => {
              const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });

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
          {field.value?.name && <Text>{field.value.name}</Text>}
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
