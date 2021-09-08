import { formatCurrencyAmount } from '../util';

export class WorkItem {
  jobContractAmount: string;
  jobContractDescription: string;
  workDescriptionType: string;

  constructor(props: any) {
    this.jobContractAmount = formatCurrencyAmount(props.JobContractAmount);
    this.jobContractDescription = props.JobContractDescription || '';
    this.workDescriptionType = props.WorkDescriptionType || '';
  }
}
