import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import {
  parseDoc,
  parseQuerySnapshotFirst,
} from "@/lib/firestore";
import type { Employee, EmployeeRecord } from "@/types/employee";

const EMPLOYEES_COLLECTION = "employees";

export function toEmployee(record: EmployeeRecord): Employee {
  const { password: _password, ...employee } = record;
  return employee;
}

export async function getEmployeeById(
  employeeId: string,
): Promise<Employee | null> {
  const snapshot = await getDoc(
    doc(firestore, EMPLOYEES_COLLECTION, employeeId),
  );
  const record = parseDoc<EmployeeRecord>(snapshot);

  if (!record || record.role?.toLowerCase() !== "employee") {
    return null;
  }

  return toEmployee(record);
}

export async function authenticateEmployee(
  email: string,
  password: string,
): Promise<Employee | null> {
  const snapshot = await getDocs(
    query(
      collection(firestore, EMPLOYEES_COLLECTION),
      where("email", "==", email.trim()),
      limit(1),
    ),
  );

  const record = parseQuerySnapshotFirst<EmployeeRecord>(snapshot);

  if (!record || record.role?.toLowerCase() !== "employee") {
    return null;
  }

  if (record.password !== password) {
    return null;
  }

  return toEmployee(record);
}
