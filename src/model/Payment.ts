import { formatCurrencyAmount, toShortDate } from '../util';

export class Payment {
  paymentAmount: string;
  paymentDate: string;
  paymentMethod: string;

  constructor(props: any) {
    this.paymentAmount = '$' + formatCurrencyAmount(props.PaymentAmount);
    this.paymentDate = toShortDate(props.PaymentDate);
    this.paymentMethod = props.PaymentMethod || '';
  }
}
