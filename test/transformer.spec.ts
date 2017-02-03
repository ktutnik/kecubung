import * as Core from "../src/core"
import { Transformer } from "../src/transformer"
import { JsParser } from "./helper"
import * as Chai from "chai"
import * as Fs from "fs"
import * as Path from "path"
import * as Babylon from "babylon"
import * as Util from "util"

describe("Transformer", () => {

    describe("Real test", () => {
        it("Should transform TypeScript generated file properly", () => {
            let filename = "./dummy/dummy.js"
            let code = Fs.readFileSync(Path.join(__dirname, filename)).toString()
            let dummy = new Transformer(filename, "ASTree");
            let ast = Babylon.parse(code);
            let result = dummy.transform(ast);
            Chai.expect(result).deep.eq({
                type: 'File',
                name: './dummy/dummy.js',
                analysis: 1,
                children:
                [{
                    type: 'Module',
                    analysis: 83,
                    children:
                    [{
                        type: 'Class',
                        name: 'MyBaseClass',
                        baseClass: null,
                        location: { start: 456, end: 633 },
                        analysis: 31,
                        constructor:
                        {
                            type: 'Constructor',
                            name: 'MyBaseClass',
                            analysis: 1,
                            location: { start: 497, end: 531 },
                            parameters: []
                        },
                        methods:
                        [{
                            type: 'Method',
                            name: 'baseMethod',
                            analysis: 1,
                            location: { start: 540, end: 595 },
                            parameters:
                            [{
                                type: 'Parameter',
                                name: 'par1',
                                analysis: 1,
                                location: { start: 585, end: 589 }
                            }]
                        }]
                    },
                    {
                        type: 'Class',
                        name: 'MyClass',
                        baseClass: 'MyBaseClass',
                        location: { start: 678, end: 944 },
                        analysis: 31,
                        constructor:
                        {
                            type: 'Constructor',
                            name: 'MyClass',
                            analysis: 1,
                            location: { start: 765, end: 841 },
                            parameters: []
                        },
                        methods:
                        [{
                            type: 'Method',
                            name: 'myMethod',
                            analysis: 1,
                            location: { start: 850, end: 899 },
                            parameters:
                            [{
                                type: 'Parameter',
                                name: 'par1',
                                analysis: 1,
                                location: { start: 889, end: 893 },
                                decorators:
                                [{
                                    type: 'Decorator',
                                    name: 'decoOne',
                                    analysis: 1,
                                    location: { start: 997, end: 1026 },
                                    parameters: []
                                }]
                            }],
                            decorators:
                            [{
                                type: 'Decorator',
                                name: 'decoOne',
                                analysis: 1,
                                location: { start: 978, end: 987 },
                                parameters: []
                            }]
                        }],
                        decorators:
                        [{
                            type: 'Decorator',
                            name: 'decoTwo',
                            analysis: 1,
                            location: { start: 1284, end: 1299 },
                            parameters:
                            [{
                                type: 'Parameter',
                                name: 'halo',
                                analysis: 1,
                                location: { start: 1284, end: 1299 }
                            }]
                        }]
                    }],
                    location: { start: 429, end: 1461 },
                    name: 'MyModule'
                }],
                location: { start: 0, end: 1462 }
            })
        })

        /*
        it("Should transform TypeScript (4.5 MB) file in less than 500ms", () => {
            let filename = "./node_modules/typescript/lib/typescript.js"
            let code = Fs.readFileSync(Path.join(process.cwd(), filename)).toString()
            let dummy = new Transformer(filename, "ASTree");
            let ast = Babylon.parse(code);
            let start = new Date()
            let result = dummy.transform(ast);
            let end = new Date();
            let gap = end.getTime() - start.getTime();
            Chai.expect(gap).lessThan(500)
        })
        */
    })
})