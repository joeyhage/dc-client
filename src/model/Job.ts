import { formatCurrencyAmount, toShortDate } from '../util/';
import { Invoice, Payment, WorkItem } from './';

export class Job {
  id: number;
  customerID: number;
  jobType: string;
  customer: string;
  contact: string;
  secondContact: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone1Type: string;
  phone1: string;
  phone2Type: string;
  phone2: string;
  phone3Type: string;
  phone3: string;
  phone4Type: string;
  phone4: string;
  estimateDate: string;
  receiveDate: string;
  startDate: string;
  completeDate: string;
  workItems: WorkItem[];
  payments: Payment[];
  invoices: Invoice[];
  totalAmount: string;
  totalPayments: string;

  constructor(props: any) {
    this.id = props.JobID;
    this.customerID = props.CustomerID;
    this.jobType = props.JobTypeDescription || 'Estimate';
    this.customer = props.JobCustomer || '';
    this.contact = props.JobContact || '';
    this.secondContact = props.JobContact2 || '';
    this.address = props.JobAddress || '';
    this.city = props.JobCity || '';
    this.state = props.JobSt || '';
    this.zip = props.JobZip || '';
    this.phone1Type = props.JobPhone1Type || 'Phone 1';
    this.phone1 = props.JobContactPhone1 || '';
    this.phone2Type = props.JobPhone2Type || 'Phone 2';
    this.phone2 = props.JobContactPhone2 || '';
    this.phone3Type = props.JobPhone3Type || 'Phone 3';
    this.phone3 = props.JobContactPhone3 || '';
    this.phone4Type = props.JobPhone4Type || 'Phone 4';
    this.phone4 = props.JobContactPhone4 || '';
    this.estimateDate = toShortDate(props.ContractDate);
    this.receiveDate = toShortDate(props.CreateDate);
    this.startDate = toShortDate(props.JobStart);
    this.completeDate = toShortDate(props.CloseDate);
    this.workItems = (props.workItems || []).map((workItem: any) => new WorkItem(workItem));
    this.payments = (props.payments || []).map((payment: any) => new Payment(payment));
    this.invoices = (props.invoices || []).map((invoice: any) => new Invoice(invoice));
    this.totalAmount = '$' + formatCurrencyAmount(props.TotalAmount);
    this.totalPayments = '$' + formatCurrencyAmount(props.TotalPayments);
  }
}
