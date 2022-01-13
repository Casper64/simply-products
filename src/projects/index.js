import * as D from "./document"
import * as P from "./parser"
import * as F from "./file-tree"
import * as E from "./editor"
import * as I from"./init"
import * as S from "./settings"
export * from "./document"
export * from "./parser"
export * from "./file-tree"
export * from "./editor"
export * from"./init"
export * from "./settings"

export default {
    ...D,
    ...P,
    ...F,
    ...E,
    ...I,
    ...S
}