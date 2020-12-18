import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useState } from "react";
import { Keyboard, Platform, SafeAreaView, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import { tap } from "rxjs/operators";
import { Doctor } from "../../models/crm/doctor.model";
import { createBlobFormData, uploadDoctorDir } from "../../services/core/upload.service";
import EmojiMenu from "../chat/emojiMenu";
import ShortcutBottomMenu from "../chat/ShortcutsBottomMenu";
import { View } from "../Themed";

export default function ChatInputs({ pid, doctor, onSend }: { pid: string, doctor?: Doctor, onSend: any }) {
  const [isShortcutsMenuVisible, setIsShortcutsMenuVisible] = useState(false);
  const [inputText, setInputText] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)

  useEffect(() => {
    // effect

    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('您禁止使用本地图片功能');
        }
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.status !== 'granted') {
          alert('您禁止使用照相机功能');
        }
      }
    })();

    return () => {
      // cleanup
    }
  }, [doctor])

  const onShortcutSelected = useCallback((shortcut) => {
    if (shortcut) {
      setInputText(inputText + shortcut);
    }
    setIsShortcutsMenuVisible(false);
  }, [inputText]);

  const onEmojiSelected = useCallback((emoji) => {
    setInputText(inputText + emoji);
  }, [inputText]);

  const showShortcutsMenu = () => {
    setIsShortcutsMenuVisible(true);
  };

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
    Keyboard.dismiss();
  }

  const hideEmojis = () => {
    setShowEmojis(false);
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    await setAndUploadImage(result);
  };

  const pickCamera = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    await setAndUploadImage(result);
  };

  const setAndUploadImage = async (result: ImagePicker.ImagePickerResult) => {
    if (!result.cancelled) {
      const formData = await createBlobFormData(result);
      uploadDoctorDir(pid, 'chat', formData).pipe(
        tap((result: { path: string }) => {
          if (result?.path) {
            // sendChatMsg(result.path, true); // send chat imagePath
            onSend(result.path, true);
          }
        })
      ).subscribe(() => {
        // scrollToEnd();
      });
    }
  }

  const send = (msg: string) => {
    setShowEmojis(false);
    setInputText('');
    onSend(msg);
  }

  return (
    <SafeAreaView style={styles.fixBottom}>
    <Input
      placeholder="请输入..."
      value={inputText}
      onChangeText={setInputText}
      onFocus={hideEmojis}
      style={styles.bottomInput}
      multiline={true}
      rightIcon={
        <Button title="发送" containerStyle={{ marginRight: -12 }} buttonStyle={{ paddingLeft: 4, paddingRight: 10 }} icon={{ type: 'ionicon', name: 'ios-paper-plane', color: 'white' }}
          disabled={!inputText} onPress={() => send(inputText)}
        />}
    />

    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', marginTop: -28, backgroundColor: 'lightgray', paddingVertical: 6, paddingHorizontal: 16 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: 'lightgray' }}>
        <Ionicons name="ios-happy" size={26} color="#0095ff"
          style={{ marginRight: 22, color: !showEmojis ? '#0095ff' : 'orange' }} onPress={toggleEmojis}></Ionicons>
        <Ionicons name="ios-image" size={26} color="#0095ff" style={styles.mr3} onPress={pickImage}></Ionicons>
        <Ionicons name="ios-camera" size={26} color="#0095ff" style={styles.mr3} onPress={pickCamera}></Ionicons>
        <Ionicons name="ios-undo" size={26} color="#0095ff" onPress={showShortcutsMenu}></Ionicons>
      </View>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', alignContent: 'center', backgroundColor: 'lightgray' }}>
        <Button type="outline" raised={true} buttonStyle={{ paddingVertical: 2, paddingHorizontal: 16 }} title="标识完成"></Button>
        <Button type="outline" raised={true} buttonStyle={{ paddingVertical: 2, paddingHorizontal: 16 }} title="返回付费咨询"></Button>
      </View>
    </View>
    {!!showEmojis &&
      <EmojiMenu onSelect={onEmojiSelected}></EmojiMenu>
    }
    {!!isShortcutsMenuVisible &&
      <ShortcutBottomMenu shortcuts={doctor?.shortcuts || ''} onSelect={onShortcutSelected}></ShortcutBottomMenu>
    }
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fixBottom: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'white',
    paddingHorizontal: 0,
    marginHorizontal: 0,
  },
  bottomInput: {
    paddingHorizontal: 2,
  },
  mr3: {
    marginRight: 22,
  }
});
