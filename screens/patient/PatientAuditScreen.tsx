import * as React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Text } from '../../components/Themed';
import { getRelationshipsByDoctorId } from '../../services/doctor.service';
import { map, tap } from 'rxjs/operators';
import { AppState } from '../../models/app-state.model';
import { Button, DataTable, Searchbar, Subheading, Switch } from 'react-native-paper';
import { User } from '../../models/crm/user.model';
import { Relationship } from '../../models/crm/relationship.model';
import moment from 'moment';
import { updateRoleById } from '../../services/user.service';
import PatientDetails from '../../components/PatientDetails';
import Spinner from '../../components/shared/Spinner';
import { updateSnackbar } from '../../services/core/app-store.actions';
import { MessageType } from '../../models/app-settings.model';

export default function PatientAuditScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);
  const initRelationsip: Relationship = { _id: '', doctor: '' };
  const [relationships, setRelationships] = useState([initRelationsip]);
  const [filterRelationships, setFilterRelationships] = useState([initRelationsip]);
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()

  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const onToggleSwitch = () => {
    const current = !isSwitchOn;
    setIsSwitchOn(current);
    setFilterRelationships(relationships.filter(_ => _.user?.role === (current ? 1 : 0)));
    setSearch('');
  };
  const [search, setSearch] = useState('')
  const onChangeSearch = (query: string) => setSearch(query);

  useEffect(() => {
    if (doctor?._id) {
      setLoading(true);
      getRelationshipsByDoctorId(doctor._id).pipe(
        map(results => {
          // remove duplicated user
          const userList: string[] = [];
          const filteredResults: Relationship[] = [];
          results?.map(result => {
            if (result?.user) {
              if (userList.findIndex(_ => _ === result.user?._id) < 0) {
                userList.push(result.user._id);
                filteredResults.push(result);
              }
            }
          });
          return filteredResults;
        }),
        tap(results => {
          setRelationships(results);
          setLoading(false);
          // init
          setIsSwitchOn(false);
          setFilterRelationships(results.filter(_ => _.user?.role === 0));
        })
      ).subscribe();
    }

    return () => {
    }
  }, [doctor?._id]);

  const auditUser = (role: number, userId?: string) => {
    if (userId) {
      updateRoleById(userId, role).pipe(
        tap(user => {
          if (user) {
            // update
            const updated = relationships.map(r => (r.user?._id === user._id ? { ...r, user } : r));
            setRelationships(updated);
            const filterUpdated = filterRelationships.map(r => (r.user?._id === user._id ? { ...r, user } : r));
            setFilterRelationships(filterUpdated);
            // success message
            dispatch(updateSnackbar('操作成功！', MessageType.success));
          } else {
            // error message
          }
        })
      ).subscribe();
    }
  }

  const [user, setUser] = useState({ _id: '' })
  const [visible, setVisible] = React.useState(false);
  const closePatientDetails = () => setVisible(false);
  const openPatientDetails = (user?: User) => {
    if (user?._id) {
      setUser(user);
      setVisible(true);
    }
  }

  if (!doctor?._id || loading) {
    return (<Spinner />);
  } else {
    return (
      <>
        <Subheading style={styles.headline}>
          <Text style={styles.m3}>{isSwitchOn ? '已审核用户' : '未审核用户'}</Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </Subheading>
        <Searchbar
          placeholder="病患用户搜索"
          onChangeText={onChangeSearch}
          value={search}
        />
        <Text> </Text>
        <ScrollView>
          <DataTable>
            <DataTable.Header style={styles.tableHeader}>
              <DataTable.Title>姓名</DataTable.Title>
              <DataTable.Title numeric>创建时间</DataTable.Title>
              <DataTable.Title numeric>操作</DataTable.Title>
            </DataTable.Header>
            {filterRelationships?.length ? (
              filterRelationships.filter(_ => _.user?.name?.match(search))
                .map((rel, i) => (
                  <DataTable.Row key={i} onPress={() => openPatientDetails(rel.user)}>
                    <DataTable.Cell key={i + '-1'}>
                      <Text>
                        {rel.user?.name}
                        {rel.user?.gender === 'M' ? '(男)' : (rel.user?.gender === 'F' ? '(女)' : '')}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric key={i + '-2'}>
                      <Text>{moment(rel.user?.created).format('YYYY年MM月DD日')}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell numeric key={i + '-3'} style={{ marginRight: -15 }}>
                      {rel.user?.role === 1 ? (
                        <Button mode="contained" icon="marker-cancel" dark={true} color="tomato" compact
                          labelStyle={{ fontSize: 11 }}
                          onPress={() => auditUser(0, rel.user?._id)}>
                          取消审核</Button>
                      ) : (
                          <Button mode="contained" icon="marker-check" compact
                            labelStyle={{ fontSize: 11 }}
                            onPress={() => auditUser(1, rel.user?._id)}>
                            审核通过</Button>
                        )
                      }
                    </DataTable.Cell>
                  </DataTable.Row>
                ))
            ) : (
                <Text style={{ backgroundColor: 'lightyellow', padding: 16, color: 'gray' }}>没有相关数据。</Text>
              )
            }
          </DataTable>
        </ScrollView>

        {!!visible &&
          <PatientDetails user={user} onClose={closePatientDetails} />
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  m3: {
    margin: 16,
    marginVertical: 16,
  },
  headline: {
    margin: 16,
    marginVertical: 12,
  },
  tableHeader: {
    backgroundColor: 'lightskyblue',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  group: {
    backgroundColor: 'paleturquoise',
    marginBottom: 1,
  },
  item: {
    backgroundColor: 'ivory',
    marginBottom: 1,
  },
});
