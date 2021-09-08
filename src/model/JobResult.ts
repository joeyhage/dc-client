import { formatCurrencyAmount, formatName, toShortDate } from '../util';

export class JobResult {
  jobID: number;
  customerID: number;
  customer: string;
  jobAddress: string;
  jobType: string;
  estimateDate: string;
  jobReceiveDate: string;
  totalAmount: string;
  totalPayments: string;

  constructor(props: any) {
    this.jobID = props.JobID;
    this.customerID = props.CustomerID;
    this.customer = formatName({
      firstName: props.Customer,
      lastName: props.CustomerLastName,
      companyName: props.CompanyName
    });
    this.jobAddress = props.JobAddress || '';
    this.jobType = props.JobTypeDescription || 'Estimate';
    this.estimateDate = toShortDate(props.ContractDate);
    this.jobReceiveDate = toShortDate(props.CreateDate);
    this.totalAmount = formatCurrencyAmount(props.TotalAmount);
    this.totalPayments = formatCurrencyAmount(props.TotalPayments);
  }
}
