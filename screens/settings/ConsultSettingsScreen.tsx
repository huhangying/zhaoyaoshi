import * as React from 'react';
import { Modal, StyleSheet } from 'react-native';
import { Card, ListItem, Text } from 'react-native-elements';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Caption, List, Paragraph, Subheading } from 'react-native-paper';
import { AppState } from '../../models/app-state.model';
import { ConsultServicePrice } from '../../models/consult/doctor-consult.model';
import { Ionicons } from '@expo/vector-icons';
import ConsultTags from './consult/ConsultTags';
import ConsultDiseaseTypes from './consult/ConsultDiseaseTypes';

export default function ConsultSettingsScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);
  const initPrice: ConsultServicePrice = { type: 0, amount: -1 };
  const [textPrice, setTextPrice] = useState(initPrice);
  const [phonePrice, setPhonePrice] = useState(initPrice);

  useEffect(() => {
    doctor?.prices?.map(price => {
      if (price.type === 0) {
        setTextPrice(price);
      } else if (price.type === 1) {
        setPhonePrice(price);
      }
    })

    return () => {
    }
  }, [doctor?.prices])

  // Tags
  const [tagsVisible, setTagsVisible] = useState(false);
  const closeConsultTags = () => setTagsVisible(false);
  const onCloseConsultTags = useCallback(() => {
    closeConsultTags();
  }, [])
  const openConsultTags = () => {
    setTagsVisible(true);
  }

  // diseaseTypes
  const [diseaseTypesVisible, setDiseaseTypesVisible] = useState(false);
  const closeConsultDiseaseTypes = () => setDiseaseTypesVisible(false);
  const onCloseConsultDiseaseTypes = useCallback(() => {
    closeConsultDiseaseTypes();
  }, [])
  const openConsultDiseaseTypes = () => {
    setDiseaseTypesVisible(true);
  }

  return (
    <>
      <Card>
        {doctor?.prices?.length ? (
          <List.Section>
            <List.Subheader>您的付费咨询已经开通</List.Subheader>
            {textPrice ? (
              <List.Item 
                key="textConsult"
                title="图文咨询"
                description={`服务价格 ${textPrice.amount}元/${textPrice.unit_count}分钟`}
                left={() => <List.Icon icon="chat-processing" color="steelblue" />} />
            ) : (
                <Text>图文咨询未开通</Text>
              )
            }
            {phonePrice ? (
              <List.Item 
                key="phoneConsult"
                title={`电话咨询`}
                description={`服务价格 ${phonePrice.amount}元/次`}
                left={() => <List.Icon icon="phone" color="teal" />} />
            ) : (
                <Text>电话咨询未开通</Text>
              )
            }
          </List.Section>
        ) : (
            <>
              <Subheading>您的付费咨询未开通</Subheading>
              <Paragraph>
                请咨询科室管理者开通付费服务。
              </Paragraph>
            </>
          )
        }
      </Card>

      {(doctor?.prices?.length && doctor.prices.length > 0) ?
        (<>
          <Caption style={styles.m3}>设置病患微信端显示内容</Caption>
          <ListItem key={1} bottomDivider onPress={openConsultTags}>
            <Ionicons name="ios-pricetags" size={24} color="sandybrown" />
            <ListItem.Content>
              <ListItem.Title>自定义标签设定</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <Text> </Text>
          <ListItem key={2} bottomDivider onPress={openConsultDiseaseTypes}>
            <Ionicons name="md-apps" size={24} color="royalblue" />
            <ListItem.Content>
              <ListItem.Title>咨询疾病类型设定</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>

          <Modal visible={tagsVisible}
            statusBarTranslucent={true}
            hardwareAccelerated={true}
            onDismiss={closeConsultTags}>
            <ConsultTags doctorid={doctor._id} onClose={onCloseConsultTags}></ConsultTags>
          </Modal>
          <Modal visible={diseaseTypesVisible}
                      statusBarTranslucent={true}
                      hardwareAccelerated={true}
                      onDismiss={closeConsultDiseaseTypes}>
            <ConsultDiseaseTypes doctorid={doctor._id} onClose={onCloseConsultDiseaseTypes}></ConsultDiseaseTypes>
          </Modal>
        </>) : (<Text> </Text>)
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  m3: {
    margin: 16,
    marginVertical: 16,
  },
});
