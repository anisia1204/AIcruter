import { useRef } from "react";
import { TextInput, View } from "react-native";
import Animated, { FadeInDown, FadeOut } from "react-native-reanimated";
import { Input } from "@/components/ui/nativeCnComponents/Input";
import { Label } from "../ui/nativeCnComponents/Label";
import { cn } from "@/lib/utils";
import { Textarea } from "../ui/nativeCnComponents/Textarea";

type TextAreaFormFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  error?: string | null;
};

const TextAreaFormField = ({
  label,
  value,
  onChangeText,
  placeholder = '',
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
}: TextAreaFormFieldProps) => {

  const inputRef = useRef<TextInput>(null);

  const handleOnLabelPress = () => {
  if (!inputRef.current) {
      return;
    }
    if (inputRef.current.isFocused()) {
      inputRef.current?.blur();
    } else {
      inputRef.current?.focus();
    }
  };

  const handleChangeText = (text: string) => {
    onChangeText(text);
  };

  return (
      <View style={{ width: "100%", marginBottom: 16 }}>
        <Label
          className={cn("pb-2 pl-1")}
          nativeID={`${label}-textareaLabel`}
          onPress={handleOnLabelPress}
        >
          {label}
        </Label>

        <Textarea
          ref={inputRef}
          placeholder={placeholder}
          value={value}
          onChangeText={handleChangeText}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          aria-labelledby={`${label}-label`}
          aria-errormessage={`${label}-error`}
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

export default TextAreaFormField;
