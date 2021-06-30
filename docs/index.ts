import { basicInfo } from "./basicInfo"
import { servers } from "./servers"
import { tags } from "./tags"
import { component } from "./components"
import { wallet } from "./wallet/index"


export const docs = {
    ...basicInfo,
    ...servers,
    ...component,
    ...tags,
    ...wallet,
}
