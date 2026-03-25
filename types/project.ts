export interface IProject{
  name:string
  status:string
  is_active:boolean
  slug:string
  created_at:string
  total_members:number

}

// User (created_by) interface
export interface IUser {
  date_joined: string;   // ISO date string
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

// Main object interface
export interface IItem {
  created_at: string;    // ISO date string
  created_by: IUser;
  is_active: boolean;
  name: string;
  slug: string;
  status: "pending" | "approved" | "rejected"; // extend if needed;
  total_members:number
}


// 👤 User detail
export interface IMemberDetail {
  date_joined: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

// 👥 Project member
export interface IProjectMember {
  is_active: boolean;
  joined_at: string;
  member_detail: IMemberDetail;
  role: string
}