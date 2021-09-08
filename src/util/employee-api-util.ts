import { DailyHours, Employee, TimecardEntry } from '../model';
import { oAuthFetch } from './auth-util';
import { padDate } from './date-util';

const EMPLOYEE_API = `https://${process.env.REACT_APP_API_DOMAIN}/api/employee`;

export const retrieveEmployeeList = (): Promise<Employee[]> => {
  return new Promise<Employee[]>(async (resolve, reject) => {
    oAuthFetch(`${EMPLOYEE_API}/list`)
      .then((results) => resolve((results || []).map((employeeData: any) => new Employee(employeeData))))
      .catch(reject);
  });
};

export const getEmployeeInfo = (employeeId: string): Promise<Employee> => {
  return new Promise<Employee>(async (resolve, reject) => {
    oAuthFetch(`${EMPLOYEE_API}/${employeeId}/info`)
      .then((employeeData: any) => resolve(new Employee(employeeData || {})))
      .catch(reject);
  });
};

export const getDailyHoursWorked = (employeeId: string, year: number, month: number): Promise<DailyHours[]> => {
  return new Promise<DailyHours[]>(async (resolve, reject) => {
    oAuthFetch(`${EMPLOYEE_API}/${employeeId}/timecard/hours/${year}/${padDate(month)}`)
      .then((results) => resolve((results || []).map((dailyHours: any) => new DailyHours(dailyHours))))
      .catch(reject);
  });
};

export const getTimecardEntries = (
  employeeId: string,
  year: number,
  month: number,
  day: number
): Promise<TimecardEntry[]> => {
  return new Promise<TimecardEntry[]>(async (resolve, reject) => {
    const paddedMonth = padDate(month);
    const paddedDay = padDate(day);
    oAuthFetch(`${EMPLOYEE_API}/${employeeId}/timecard/entries/${year}/${paddedMonth}/${paddedDay}`)
      .then((results) => resolve((results || []).map((timecardEntries: any) => new TimecardEntry(timecardEntries))))
      .catch(reject);
  });
};

export const createTimecardReport = (employeeId: string, startDate: Date, endDate: Date): Promise<TimecardEntry[]> => {
  return new Promise<TimecardEntry[]>(async (resolve, reject) => {
    oAuthFetch(
      `${EMPLOYEE_API}/${employeeId}/timecard/entries/report`,
      'POST',
      JSON.stringify({
        startDate: startDate.toISOString().substring(0, 10),
        endDate: endDate.toISOString().substring(0, 10)
      })
    )
      .then((results) => resolve((results || []).map((timecardEntries: any) => new TimecardEntry(timecardEntries))))
      .catch(reject);
  });
};

export const saveTimecardEntry = (
  employeeId: string,
  timecardEntry: Pick<TimecardEntry, 'id' | 'hours' | 'location' | 'description'> & { date: number | null }
): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    oAuthFetch(`${EMPLOYEE_API}/${employeeId}/timecard/save`, 'PUT', JSON.stringify(timecardEntry))
      .then(resolve)
      .catch(reject);
  });
};

export const deleteTimecardEntry = (employeeId: string, timecardId: TimecardEntry['id']): Promise<void> => {
  return new Promise<void>(async (resolve, reject) => {
    oAuthFetch(`${EMPLOYEE_API}/${employeeId}/timecard/${timecardId}`, 'DELETE').then(resolve).catch(reject);
  });
};
