import { Schema } from "mongoose";


export interface IGroupCreateForm {
    id: String;
    name: String;
    createdAt: String;
    topics: Schema.Types.Array;
  }
  