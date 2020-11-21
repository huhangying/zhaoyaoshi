import * as React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import { Text, View } from '../../components/Themed';
import { getAllBookingsByDoctorId, getBookingStatus, getPeriods } from '../../services/booking.service';
import { tap } from 'rxjs/operators';
import { List, Subheading } from 'react-native-paper';
import moment from 'moment';
import { Booking } from '../../models/reservation/booking.model';
import { Period } from '../../models/reservation/schedule.model';
import { forkJoin } from 'rxjs';

export default function BookingsScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);
  const initBooking: Booking = { _id: '', doctor: '', status: 0 };
  const [bookings, setBookings] = useState([initBooking]);
  const initPeriod: Period = { _id: '', name: '', from: 0 };
  const [periods, setPeriods] = useState([initPeriod]);
  const [loading, setLoading] = useState(false);

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
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else {
    return (
      <>
        <ScrollView>
          <List.Item style={styles.tableHeader}
            title="预约"
            right={() => <Subheading>状态</Subheading>}
          />
          {bookings?.length ? (
            bookings.map((booking, i) => (
              <List.Item style={{ borderBottomWidth: 1, borderBottomColor: 'lightgray' }}
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
    marginVertical: 12,
  },
  tableHeader: {
    backgroundColor: 'lightskyblue',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  status: {
    margin: 10,
    marginVertical: 18,
  }
});
