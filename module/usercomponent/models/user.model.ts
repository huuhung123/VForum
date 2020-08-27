export interface IUserCreateForm {
  id: String;
  email: String;
  password: String;
  display_name: String;
  gender: String;
  role: String;
  createdAt: String;
}

export interface IUserLoginForm {
  email: string;
  password: String;
}
