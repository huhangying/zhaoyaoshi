import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { Icon, ListItem } from "react-native-elements";
import { Button, Dialog, Divider } from "react-native-paper";
import PatientDetails from "../../../components/PatientDetails";
import { User } from "../../../models/crm/user.model";


export default function ViewPatient({ visible, user }: { visible: boolean, user: User }) {

  const [showDetails, setShowDetails] = useState(false)

  const close = () => {
    setShowDetails(false)
  }

  if (!visible) {
    return <></>;
  } else
    return (<>
      <Button onPress={() => setShowDetails(true)}>show</Button>

      {showDetails &&
        <PatientDetails user={user} onClose={close} />
      }
      {/* <Dialog visible={showDetails} style={{ left: 0, right: 0 }}>
        <Dialog.Title>
          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{`${user.name}个人信息`} </Text>
            <Pressable onPress={close}>
              <Icon
                name='ios-close'
                type='ionicon'
                color='#517fa4'
                style={{ width: 30, paddingVertical: 2, paddingLeft: 10, paddingRight: 2, marginTop: -4 }}
              />
            </Pressable>
          </View>
        </Dialog.Title>
        <Divider></Divider>
        <Dialog.Content style={{ backgroundColor: 'white' }}>
          <Text>{user.gender}</Text>
        </Dialog.Content>
      </Dialog> */}
    </>);
}


const styles = StyleSheet.create({
  lineBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  checkBoxSearchItem: {
    backgroundColor: 'white',
    borderColor: 'white',
    paddingHorizontal: 0,
    marginLeft: -12,
  },
  textHint: {
    paddingHorizontal: 16,
    paddingTop: 8,
    color: 'gray',
    fontSize: 12,
  },
});
