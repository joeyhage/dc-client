export class Employee {
  id: string;
  firstName: string;
  lastName: string;
  upn: string;
  newEmployee: boolean;

  constructor(props: any) {
    this.id = props.id;
    this.firstName = props.first_name;
    this.lastName = props.last_name;
    this.upn = props.user_principal_name;
    this.newEmployee = Boolean(props.new_employee);
  }
}
