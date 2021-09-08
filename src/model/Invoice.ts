import { formatCurrencyAmount, toShortDate } from '../util';

export class Invoice {
  invoiceAmount: string;
  invoiceDate: string;

  constructor(props: any) {
    this.invoiceAmount = '$' + formatCurrencyAmount(props.InvoiceAmount);
    this.invoiceDate = toShortDate(props.InvoiceDate);
  }
}
