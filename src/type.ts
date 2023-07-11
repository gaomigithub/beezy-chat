export interface IDepartment {
  name: string;
  isSub:string;//是否是创建子部门
  department_id: string; //部门id
}

export interface Ipersonnel {
  name: string;
  mobile: string;
  department_ids: string[]; //用户所属部门的ID列表
  employee_type: EmployeeTypeEnum; //人员类型
}
export enum EmployeeTypeEnum {
  formal = 1, //正式
  intern = 2, //实习
}
