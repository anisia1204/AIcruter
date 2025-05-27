import { useRef } from "react";
import { TextInput, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { Input } from "@/components/ui/nativeCnComponents/Input";
import { Label } from "../ui/nativeCnComponents/Label";
import { cn } from "@/lib/utils";

type FormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string | null;
  editable?: boolean;
};

const FormField = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  editable = true,
}: FormFieldProps) => {

  const inputRef = useRef<TextInput>(null);

  const handleOnLabelPress = () => {
    inputRef.current?.isFocused() ? inputRef.current?.blur() : inputRef.current?.focus();
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
  };

  return (
      <View style={{ width: "100%", marginBottom: 16 }}>
        <Label
          className={cn("pb-2 pl-1")}
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
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          aria-labelledby={`${label}-label`}
          aria-errormessage={`${label}-error`}
          style={[{ backgroundColor: '#f9f9f9' }]}
          editable={editable}
        />

        {error && (
          <Animated.Text
            entering={FadeInDown}
            exiting={FadeOut.duration(275)}
            className="text-destructive text-sm px-1 py-1.5"
            aria-invalid="true"
            id={`${label}-error`}
          >
            {error}
          </Animated.Text>
        )}
      </View>
  );
};

export default FormField;
