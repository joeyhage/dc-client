import { toDateTime, toUTC } from '../util';

export class TimecardEntry {
  id: number;
  date: Date;
  hours: number;
  location: string;
  description: string;
  createdTimestamp: string;
  modifiedTimestamp: string;
  createdBy: string;
  lastModifiedBy: string;

  constructor(props: any) {
    this.id = props.id;
    this.date = toUTC(new Date(props.timecard_date));
    this.hours = props.hours;
    this.location = props.location;
    this.description = props.description;
    this.createdTimestamp = toDateTime(props.created_ts);
    this.modifiedTimestamp = toDateTime(props.modified_ts);
    this.createdBy = props.created_by;
    this.lastModifiedBy = props.last_modified_by;
  }
}
