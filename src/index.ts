import * as Core from "./core"
import { Transformer } from "./transformer"

function transform(ast, fileName:string) {
    let transformer = new Transformer(fileName)
    return transformer.transform(ast);
}

export{transform, Core}