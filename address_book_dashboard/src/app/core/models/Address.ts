import { Department } from "./Department";
import { Job } from "./Job";

export class Address {
    Id!: number;
    FullName!: string;
    JobId!: number;
    DepartmentId!: number;
    MobileNumber!: string;
    DateOfBirth!: Date;
    AddressLine!: string;
    Email!: string;
    Password!: string;
    Photo!: string;
    Job?: Job;
    Department?: Department;

    // Computed property (not mapped in backend)
    get Age(): number {
        if (!this.DateOfBirth) return 0;
        const today = new Date();
        let age = today.getFullYear() - new Date(this.DateOfBirth).getFullYear();
        const m = today.getMonth() - new Date(this.DateOfBirth).getMonth();
        if (m < 0 || (m === 0 && today.getDate() < new Date(this.DateOfBirth).getDate())) {
            age--;
        }
        return age;
    }
}
export class AddressDto {
  Id!: number;
  FullName!: string;
  AddressLine!: string;
  Email!: string;
  MobileNumber!: string;
  Age!: number;
  JobName!: string;
  DepartmentName!: string;
  DateOfBirth!: string; 
}
