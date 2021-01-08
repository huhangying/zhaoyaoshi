import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Avatar, Card, Icon, ListItem } from 'react-native-elements';
import { imgSource } from '../../services/core/image.service';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Text } from '../../components/Themed';
import { AppState } from '../../models/app-state.model';
import { DataTable } from 'react-native-paper';
import { getRoleLabel } from '../../services/doctor.service';
import Spinner from '../../components/shared/Spinner';

export default function ProfileScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);

  useEffect(() => {
    return () => {
    }
  }, [])

  if (!doctor) {
    return (<Spinner />);
  } else {
    return (
      <ScrollView>
        <Card containerStyle={{ padding: 16, margin: 0, flex: 1, alignItems: 'center' }} >

          <Avatar
            rounded size="large"
            source={imgSource(doctor?.icon)}
          />
          <Text style={{ marginVertical: 12, }}>
            {doctor?.name}{doctor?.title}</Text>
          <Text>{doctor?.department?.name}</Text>
        </Card>

        <Card containerStyle={styles.cardContainer}>
          <ListItem bottomDivider>
            <Icon name='assignment' color='#00aced' />
            <ListItem.Content>
              <ListItem.Title> 基本信息 </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <DataTable>
            <DataTable.Row>
              <DataTable.Cell numeric style={styles.itemLabel}>用户名:</DataTable.Cell>
              <DataTable.Cell style={styles.item}>{doctor.user_id}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell numeric style={styles.itemLabel}>角色:</DataTable.Cell>
              <DataTable.Cell style={styles.item}>{getRoleLabel(doctor.role)}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell numeric style={styles.itemLabel}>手机:</DataTable.Cell>
              <DataTable.Cell style={styles.item}>{doctor.cell}</DataTable.Cell>
            </DataTable.Row>
            <DataTable.Row>
              <DataTable.Cell numeric style={styles.itemLabel}>二维码:</DataTable.Cell>
              <DataTable.Cell style={styles.item}>
                <Avatar
                  size="xlarge"
                  source={{ uri: doctor?.qrcode }} />
              </DataTable.Cell>
            </DataTable.Row>
          </DataTable>
        </Card>

        <Card containerStyle={styles.cardContainer}>
          <ListItem bottomDivider>
            <Icon name='schedule' color='#00aced' />
            <ListItem.Content>
              <ListItem.Title> 工作时间 </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <Text style={styles.cardBody}>
            {doctor.hours}
          </Text>
        </Card>

        <Card containerStyle={styles.cardContainer}>
          <ListItem bottomDivider>
            <Icon name='verified' color='#00aced' />
            <ListItem.Content>
              <ListItem.Title> 擅长领域 </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <Text style={styles.cardBody}>
            {doctor.expertise}
          </Text>
        </Card>

        <Card containerStyle={styles.cardContainer}>
          <ListItem bottomDivider>
            <Icon name='chrome-reader-mode' color='#00aced' />
            <ListItem.Content>
              <ListItem.Title> 工作范围 </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <Text style={styles.cardBody}>
            {doctor.bulletin}
          </Text>
        </Card>

        <Card containerStyle={styles.cardContainer}>
        <ListItem bottomDivider>
            <Icon name='school' color='#00aced' />
            <ListItem.Content>
              <ListItem.Title> 获奖情况 </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <Text style={styles.cardBody}>
            {doctor.honor}
          </Text>
        </Card>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    paddingTop: 6,
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',

  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    width: 100,
    marginLeft: 15,
    marginRight: 15,
  },
  itemLabel: {
    marginLeft: -140,
    color: 'gray',
  },
  cardContainer: {
    padding: 0, 
    margin: 0,
    marginTop: 22,
  },
  cardBody: {
    paddingTop: 16,
    paddingBottom: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    fontSize: 15,
    lineHeight: 22,
  }
});
