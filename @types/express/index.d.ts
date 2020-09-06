import { UserSchema, IUser } from "../../common/model/common.model"


declare global{
    namespace Express {
        interface Request {
            authorized_user: USerSchema
        }
    }
}