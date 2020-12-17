import 'moment/locale/zh-cn'
import moment from 'moment';

export const getDateFormat = (date?: Date) => {
  return !date ? '' : moment(date).format('LL');
}

export const getDateTimeFormat = (date?: Date) => {
  return !date ? '' : moment(date).format('LL a h:mm');
}
