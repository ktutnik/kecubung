import * as babylon from "babylon";
import { MetaData, flag } from "../src/core"

export module JsParser {
    export function getAst(code: string, complete = false) {
        let ast = <any>babylon.parse(code);

        return complete ? ast : ast.program.body[0];
    }
}
