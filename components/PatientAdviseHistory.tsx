import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, Text, Pressable, useWindowDimensions } from 'react-native';
import { User } from '../models/crm/user.model';
import Spinner from './shared/Spinner';
import { useSelector } from 'react-redux';
import { AppState } from '../models/app-state.model';
import { geUserAdviseHistory } from '../services/advise.service';
import { Advise } from '../models/survey/advise.model';
import { finalize, tap } from 'rxjs/operators';
import { Button, Icon, ListItem } from 'react-native-elements';
import SurveyQuestions from '../screens/consult/advise/SurveyQuestions';
import { Divider } from 'react-native-paper';
import { getDateTimeFormat } from '../services/core/moment';


export default function PatientAdviseHistory({ user }: { user: User }) {
  const dimensions = useWindowDimensions();
  const doctor = useSelector((state: AppState) => state.doctor);

  const initAdvises: Advise[] = [];
  const [advises, setAdvises] = useState(initAdvises)
  const initAdviseDetails: Advise = { doctor: '', name: '' };
  const [adviseDetails, setAdviseDetails] = useState(initAdviseDetails)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    geUserAdviseHistory(user._id).pipe(
      tap(results => {
        if (results?.length) {
          // filter by applying isOpen
          results = results.filter(_ => _.doctor === doctor?._id || (_.doctor !== doctor?._id && _.isOpen));
        }
        setAdvises(results);
      }),
      finalize(() => {
        setIsLoading(false)
      })
    ).subscribe();
    return () => {
    }
  }, [user, doctor])

  const viewAdviseDetails = (advise: Advise) => {
    // console.log(advise);
    setAdviseDetails(advise);
  }


  if (isLoading) {
    return (<Spinner />);
  } else {
    return (
      <>
        <ScrollView style={{ minHeight: 278, maxHeight: dimensions.height - 400, marginHorizontal: -12, flexGrow: 0 }}>
          {!adviseDetails?._id && (
            <>
              {advises.map((advise, i) => (
                <ListItem key={i} bottomDivider>
                  <ListItem.Content>
                    {advise.doctorDepartment && (
                      <ListItem.Title>
                        {advise.doctorDepartment}
                      </ListItem.Title>
                    )}
                    <ListItem.Title>
                      {advise.doctorName}{advise.doctorTitle}
                    </ListItem.Title>
                    <ListItem.Subtitle>{getDateTimeFormat(advise.createdAt)}</ListItem.Subtitle>
                  </ListItem.Content>

                  <Pressable onPress={() => viewAdviseDetails(advise)}>
                    <ListItem.Chevron type='ionicon' name="ios-arrow-forward" size={24} color="gray" style={{ padding: 4 }} />
                  </Pressable>
                </ListItem>
              ))}

              {!advises?.length && (
                <Text style={styles.alert}>该病患暂无线下咨询历史记录。</Text>
              )}
            </>
          )}

          {adviseDetails?._id && (
            <>
              <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 8, backgroundColor: 'azure' }}>
                <Button type="clear"
                  icon={<Icon name="chevron-left" size={24} color="royalblue" />}
                  onPress={() => setAdviseDetails(initAdviseDetails)}
                />

                <Pressable style={{ flexDirection: 'column' }}
                  onPress={() => setAdviseDetails(initAdviseDetails)}>
                  <Text style={{ color: 'royalblue', fontWeight: 'bold', textAlign: 'center' }}>
                    线下咨询详细
                  </Text>
                  <Text style={{ color: 'gray' }}>
                    药师：{adviseDetails.doctorName}{adviseDetails.doctorTitle}
                  </Text>
                  <Text style={{ color: 'gray' }}>
                    时间：{getDateTimeFormat(adviseDetails.createdAt)}
                  </Text>
                </Pressable>
              </View>
              <Divider />
              <SurveyQuestions questions={adviseDetails.questions || []} readonly={true}></SurveyQuestions>
            </>
          )}
        </ScrollView>
      </>
    )
  }
}


const styles = StyleSheet.create({
  alert: {
    padding: 16,
    marginVertical: 16,
    marginHorizontal: 0,
    backgroundColor: 'lightyellow',
  },
  headerTitle: {
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  content: {
    marginTop: 16,
  },
  item: {
    paddingVertical: 10,
  }
});
