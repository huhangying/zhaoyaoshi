import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, View, Text, SafeAreaView, Platform, Pressable } from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default function ImageZoomViewer({ visible, img, title, onClose }: { visible: boolean, img: any, title?: string, onClose: any }) {
  return (
    <Modal visible={visible} transparent={true}>
      <ImageViewer
        imageUrls={[{ url: img }]} enableSwipeDown={true} onCancel={onClose}
        saveToLocalByLongPress={false}
        renderIndicator={(currentIndex, allSize) => <Text></Text>}
        renderHeader={(currentIndex) => (<SafeAreaView style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
          {Platform.OS === "ios" ? (<>
            <Pressable onPress={onClose}>
              <Text style={{ color: 'white', top: 4, position: 'absolute', alignSelf: 'center', paddingHorizontal: 20, marginTop: -20 }}>
                {title}</Text>
            </Pressable>
          </>) : (<>
            <Text style={{ color: 'white', top: 2, position: 'absolute', alignSelf: 'center', zIndex: 999, marginTop: 24 }}>{title}</Text>
            <Ionicons name="ios-close-circle-outline" size={28} color="white" onPress={onClose}
              style={{ alignSelf: 'flex-end', marginTop: 20, paddingHorizontal: 20, zIndex: 999 }} />
          </>)}
        </SafeAreaView>)}
      />
    </Modal>
  );
}