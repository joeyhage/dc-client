import { getMonthHuman } from '@wojtekmaj/date-utils';
import { ViewCallbackProperties } from 'react-calendar';
import { DailyHours, Employee, TimecardEntry } from '../../model';
import { TimecardProps } from '../../pages';
import { getAppAuth, getDailyHoursWorked, getEmployeeInfo, getTimecardEntries } from '../../util';

export const onPageLoadPromises = (
  currentDate: Date,
  match: TimecardProps['match']
): [Promise<Employee>, Promise<DailyHours[]>, Promise<TimecardEntry[]>] => {
  const appAuth = getAppAuth();
  const employeeId = match?.params?.employeeID || appAuth.employeeId;
  return [
    getEmployeeInfo(employeeId),
    getDailyHoursWorked(employeeId, currentDate.getFullYear(), getMonthHuman(currentDate)),
    getTimecardEntries(employeeId, currentDate.getFullYear(), getMonthHuman(currentDate), currentDate.getDate())
  ];
};

export const onStartDateChangePromises = (
  employee: Employee,
  newDate: Date,
  value: ViewCallbackProperties['value']
): [Promise<DailyHours[]>, Promise<TimecardEntry[] | undefined>] => {
  return [
    getDailyHoursWorked(employee.id, newDate.getFullYear(), getMonthHuman(newDate)),
    value.getTime() === newDate.getTime()
      ? Promise.resolve(undefined)
      : getTimecardEntries(employee.id, newDate.getFullYear(), getMonthHuman(newDate), newDate.getDate())
  ];
};
