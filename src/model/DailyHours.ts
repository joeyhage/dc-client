import { toDayOfMonth } from '../util';

export class DailyHours {
  dayOfMonth: string;
  totalHours: number;

  constructor(props: any) {
    this.dayOfMonth = toDayOfMonth(props.timecard_date);
    this.totalHours = props.total_hours;
  }
}
