import * as React from 'react';
import { useCallback,  useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../models/app-state.model';
import { User } from '../../models/crm/user.model';
import PatientDetails from '../../components/PatientDetails';
import SelectPatient from '../../components/shared/SelectPatient';

export default function RelationshipScreen() {
  const doctor = useSelector((state: AppState) => state.doctor);

  const onSelectPatient = useCallback((user: User) => {
    if (user) {
      openPatientDetails(user)
    }
  }, []);

  const [user, setUser] = useState({ _id: '' })
  const [visible, setVisible] = React.useState(false);
  const closePatientDetails = () => setVisible(false);
  const openPatientDetails = (user?: User) => {
    if (user?._id) {
      setUser(user);
      setVisible(true);
    }
  }

  return (
    <>
      <SelectPatient doctorId={doctor?._id} onSelect={onSelectPatient}></SelectPatient>
      {!!visible &&
        <PatientDetails user={user} onClose={closePatientDetails} />
      }
    </>
  );
}
