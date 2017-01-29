import * as babylon from "babylon";
import { MetaData, flag } from "../src/core"
import * as Analyzer from "../src/analyzers"

export let parsers: Analyzer.ParserType[] = ["ASTree"]

export module JsParser {
    export function getAst(code: string, complete = false) {
        let ast = <any>babylon.parse(code);

        return complete ? ast : ast.program.body[0];
    }
}
