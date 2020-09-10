declare namespace Express {
  export interface Request {
    authorized_user: {
      role: string;
      _id: string;
      display_name: string;
    };
  }
}
