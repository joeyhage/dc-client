import { formatName } from '../util';
import { JobResult } from './';

export class Customer {
  id: string;
  name: string;
  customer2Name: string;
  billingContact: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone1Type: string;
  phone1: string;
  phoneExt1: string;
  phone2Type: string;
  phone2: string;
  phoneExt2: string;
  phone3Type: string;
  phone3: string;
  phoneExt3: string;
  phone4Type: string;
  phone4: string;
  phoneExt4: string;
  emailOne: string;
  emailTwo: string;
  jobs: JobResult[];

  constructor(props: any) {
    this.id = props.CustomerID;
    this.name = formatName({
      firstName: props.Customer,
      lastName: props.CustomerLastName,
      companyName: props.CompanyName
    });
    this.customer2Name = formatName({
      firstName: props.CustomerFirstName2,
      lastName: props.CustomerLastName2
    });
    this.billingContact = formatName({
      firstName: props.BillingContactFirstName,
      lastName: props.BillingContactLastName,
      companyName: props.BillingContactCompanyName
    });
    this.address = props.BillingAddress || '';
    this.city = props.BillingCity || '';
    this.state = props.BillingState || '';
    this.zip = props.BillingZip || '';
    this.phone1Type = props.BillingPhone1Type || 'Phone 1';
    this.phone1 = props.BillingPhone1 || '';
    this.phoneExt1 = props.BillingExt1 || '';
    this.phone2Type = props.BillingPhone2Type || 'Phone 2';
    this.phone2 = props.BillingPhone2 || '';
    this.phoneExt2 = props.BillingExt2 || '';
    this.phone3Type = props.BillingPhone3Type || 'Phone 3';
    this.phone3 = props.BillingPhone3 || '';
    this.phoneExt3 = props.BillingExt3 || '';
    this.phone4Type = props.BillingPhone4Type || 'Phone 4';
    this.phone4 = props.BillingFax || '';
    this.phoneExt4 = props.BillingExt4 || '';
    this.emailOne = props.EmailOne || '';
    this.emailTwo = props.EmailTwo || '';
    this.jobs = (props.jobs || []).map((job: any) => new JobResult(job));
  }
}
