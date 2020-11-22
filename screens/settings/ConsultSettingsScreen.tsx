import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Divider, ListItem, Text } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { imgPath } from '../../services/core/image.service';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { Caption, List, Paragraph, Subheading } from 'react-native-paper';
import EditTextList from '../../components/EditTextList';
import { AppState } from '../../models/app-state.model';
import { ConsultServicePrice } from '../../models/consult/doctor-consult.model';
import { Ionicons } from '@expo/vector-icons';

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
  }, [doctor])

  return (
    <>
      <Card>
        {doctor?.prices?.length ? (
          <List.Section>
            <List.Subheader>您的付费咨询已经开通</List.Subheader>
            {textPrice ? (
              <List.Item key="textConsult"
                title="图文咨询"
                description={`服务价格 ${textPrice.amount}元/${textPrice.unit_count}分钟`}
                left={() => <List.Icon icon="chat-processing" color="steelblue" />} />
            ) : (
                <Text>图文咨询未开通</Text>
              )
            }
            {phonePrice ? (
              <List.Item key="phoneConsult"
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

      {doctor?.prices?.length &&
        <>
          <Caption style={styles.m3}>设置病患微信端显示</Caption>
          <ListItem key={1} bottomDivider >
            <Ionicons name="ios-pricetags" size={24} color="sandybrown" />
            <ListItem.Content>
              <ListItem.Title>自定义标签设置</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
          <Text> </Text>
          <ListItem key={2} bottomDivider >
            <Ionicons name="md-apps" size={24} color="royalblue" />
            <ListItem.Content>
              <ListItem.Title>咨询疾病类型设定</ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron />
          </ListItem>
        </>
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
