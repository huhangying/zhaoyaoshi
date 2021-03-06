import { useNavigation } from '@react-navigation/native';
import * as React from 'react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import SelectPatient from '../../components/shared/SelectPatient';
import { AppState } from '../../models/app-state.model';
import { User } from '../../models/crm/user.model';
import { NotificationType } from '../../models/io/notification.model';

export default function SelectChatScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);
  const { navigate } = useNavigation();

  const onSelectPatient = useCallback((user: User) => {
    if (user) {
      navigate('ChatScreen', { pid: user._id,  type: NotificationType.chat, title: user.name + '免费咨询' });
    }
  }, [navigate]);

  return (
    <>
      <SelectPatient key="select-p" doctorId={doctor?._id} onSelect={onSelectPatient}></SelectPatient>
    </>
  );
}