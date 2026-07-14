export interface Employee {
  id: string;
  email?: string;
  role?: string;
  name?: string;
}

export interface EmployeeRecord extends Employee {
  password?: string;
}
