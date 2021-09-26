export class User {
  $key: string;
  userId: string;
  userName: string;
  emailId: string;
  password: string;
  phoneNumber: string;
  createdOn?: string;
  userRole: string;
  isAdmin: boolean;
  avatar?: string;
  active: boolean;
  token: string;
  tokendate: Date;
  createdAt?: Date;
  userCategories: string[];
  logo: File;
  mayoreo: [[string, string, number]]
}

export class UserDetail {
  $key: string;
  firstName: string;
  lastName: string;
  userName: string;
  emailId: string;
  address1: string;
  address2: string;
  country: string;
  state: string;
  zip: number;
}
