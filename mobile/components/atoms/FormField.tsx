import { useRef, useState } from "react";
import { Platform, TextInput, View, ScrollView } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { Input } from "@/components/ui/nativeCnComponents/Input";
import { Label } from "../ui/nativeCnComponents/Label";
import { cn } from "@/lib/utils";
import { ThemedText } from "@/components/ThemedText";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
};

const FormField = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}: FormFieldProps) => {
  const inputRef = useRef<TextInput>(null);
  const [err, setErr] = useState<string | null>(null);

  const handleOnLabelPress = () => {
    inputRef.current?.isFocused() ? inputRef.current?.blur() : inputRef.current?.focus();
  };

  const handleChangeText = (text: string) => {
    if (err) setErr(null);
    onChangeText(text);
  };

  const handleSubmit = () => {
    if (!value.trim()) {
      setErr("This field cannot be empty.");
    }
  };

  return (
    <ScrollView contentContainerStyle={{ justifyContent: "center", alignItems: "center", paddingHorizontal: 10 }}>
      <View style={{ width: "100%", marginBottom: 16 }}>
        <Label
          className={cn(err && "text-destructive", "pb-2 pl-1")}
          nativeID={`${label}-label`}
          onPress={handleOnLabelPress}
        >
          {label}
        </Label>

        <Input
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          aria-labelledby={`${label}-label`}
          aria-errormessage={`${label}-error`}
        />

        {err && (
          <Animated.Text
            entering={FadeInDown}
            exiting={FadeOut.duration(275)}
            className="text-destructive text-sm px-1 py-1.5"
            aria-invalid="true"
            id={`${label}-error`}
          >
            {err}
          </Animated.Text>
        )}
      </View>
    </ScrollView>
  );
};

export default FormField;
