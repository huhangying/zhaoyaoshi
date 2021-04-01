import * as React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import { Text } from '../../components/Themed';
import { getAllBookingsByDoctorId, getBookingStatus, getPeriods } from '../../services/booking.service';
import { tap } from 'rxjs/operators';
import { List, Subheading, Switch } from 'react-native-paper';
import moment from 'moment';
import { Booking } from '../../models/reservation/booking.model';
import { Period } from '../../models/reservation/schedule.model';
import { forkJoin } from 'rxjs';
import Spinner from '../../components/shared/Spinner';

export default function BookingsScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);
  const initBooking: Booking = { _id: '', doctor: '', status: 0 };
  const [bookings, setBookings] = useState([initBooking]);
  const [filterBookings, setFilterBookings] = useState([initBooking]);
  const initPeriod: Period = { _id: '', name: '', from: 0 };
  const [periods, setPeriods] = useState([initPeriod]);
  const [loading, setLoading] = useState(false);

  const [isSwitchOn, setIsSwitchOn] = React.useState(true);
  const onToggleSwitch = () => {
    const current = !isSwitchOn;
    setIsSwitchOn(current);
    const filtered = current ?
      bookings.filter(_ => moment(_.date).isSameOrAfter(moment().add(-1, 'd'))) :
      bookings.filter(_ => moment(_.date).isBefore(moment().add(-1, 'd')));
    setFilterBookings(filtered);
  };

  useEffect(() => {
    if (doctor?._id) {
      setLoading(true);
      forkJoin({
        bookings: getAllBookingsByDoctorId(doctor._id),
        periods: getPeriods()
      }).pipe(
        tap(({ bookings, periods }) => {
          setBookings(bookings);
          setPeriods(periods);
          setLoading(false);
          // init
          setIsSwitchOn(true);
          setFilterBookings(bookings.filter(_ => moment(_.date).isSameOrAfter(moment().add(-1, 'd'))));
        })
      ).subscribe();
    }
    return () => {
    }
  }, [doctor?._id])

  const getPeriod = (id?: string) => {
    if (!id) return '';
    return periods.find(_ => _._id)?.name || '';
  }

  if (!doctor?._id || loading) {
    return (<Spinner/>);
  } else {
    return (
      <>
        <Subheading style={styles.headline}>
          <Text style={styles.mx3}>{isSwitchOn ? '当前门诊预约' : '已过期门诊预约（二个月内）'}</Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </Subheading>
        <ScrollView>
          <List.Item style={styles.tableHeader}
            title="预约"
            right={() => <Subheading style={{ paddingTop: 4 }}>状态</Subheading>}
          />
          {filterBookings?.length ? (
            filterBookings.map((booking, i) => (
              <List.Item key={i} style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}
                title={moment(booking.date).format('YYYY年MM月DD日') + ' ' + getPeriod(booking.schedule?.period)}
                description={booking.user?.name + (booking.user?.gender === 'M' ? ' (男)' : (booking.user?.gender === 'F' ? ' (女)' : ''))}
                right={() => <Text style={styles.status}>{getBookingStatus(booking.status)}</Text>}
              />
            ))
          ) : (
              <Text style={styles.headline}>没有相关数据。</Text>
            )
          }
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  headline: {
    margin: 16,
    marginVertical: 16,
  },
  mx3: {
    marginHorizontal: 14,
  },
  tableHeader: {
    backgroundColor: 'lightskyblue',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  status: {
    margin: 10,
    marginVertical: 16,
  }
});
