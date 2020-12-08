import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Avatar, Card } from 'react-native-elements';
import { imgPath } from '../../services/core/image.service';
import { useEffect } from 'react';
import { useSelector, useStore } from 'react-redux';
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
    return (<Spinner/>);
  } else {
    return (
      <ScrollView>
        <Card containerStyle={{ padding: 10, margin: 0, flex: 1, alignItems: 'center' }} >

          <Avatar
            rounded size="large"
            source={{ uri: imgPath(doctor?.icon) }}
          />
          <Text style={{ marginVertical: 12, }}>
            {doctor?.name}{doctor?.title}</Text>
          <Text>{doctor?.department?.name}</Text>
        </Card>

        <Card containerStyle={{ padding: 10, margin: 0, marginTop: 20, flex: 1 }}>
          <Card.Title>基本信息</Card.Title>
          <Card.Divider />
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

        <Card containerStyle={{ padding: 10, margin: 0, marginTop: 20, flex: 1 }}>
          <Card.Title>工作时间</Card.Title>
          <Card.Divider />
          <Text style={styles.mx3}>
            {doctor.hours}
          </Text>
        </Card>

        <Card containerStyle={{ padding: 10, margin: 0, marginTop: 20, flex: 1 }}>
          <Card.Title>擅长领域</Card.Title>
          <Card.Divider />
          <Text style={styles.mx3}>
            {doctor.expertise}
          </Text>
        </Card>

        <Card containerStyle={{ padding: 10, margin: 0, marginTop: 20, flex: 1 }}>
          <Card.Title>工作范围</Card.Title>
          <Card.Divider />
          <Text style={styles.mx3}>
            {doctor.bulletin}
          </Text>
        </Card>

        <Card containerStyle={{ padding: 10, margin: 0, marginTop: 20, flex: 1 }}>
          <Card.Title>获奖情况</Card.Title>
          <Card.Divider />
          <Text style={styles.mx3}>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  item: {
    width: 100,
    marginLeft: 15,
    marginRight: 50,
  },
  itemLabel: {
    marginLeft: -30,
  },
  mx3: {
    marginHorizontal: 16,
    marginBottom: 8,
  }
});
