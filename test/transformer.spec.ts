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
            //console.log(Util.inspect(result.children, false, null))
            Chai.expect(Path.resolve(result.name)).eq(Path.resolve(filename))
            Chai.expect(result.children).deep.eq([{
                type: 'Module',
                analysis: 83,
                children:
                [{
                    type: 'Class',
                    name: 'MyBaseClass',
                    baseClass: null,
                    location: { start: 519, end: 696 },
                    analysis: 31,
                    constructor:
                    {
                        type: 'Constructor',
                        name: 'MyBaseClass',
                        analysis: 1,
                        location: { start: 560, end: 594 },
                        parameters: []
                    },
                    methods:
                    [{
                        type: 'Method',
                        name: 'baseMethod',
                        analysis: 1,
                        location: { start: 603, end: 658 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'par1',
                            analysis: 1,
                            location: { start: 648, end: 652 }
                        }]
                    }]
                },
                {
                    type: 'Class',
                    name: 'MyClass',
                    baseClass: 'MyBaseClass',
                    location: { start: 741, end: 1007 },
                    analysis: 31,
                    constructor:
                    {
                        type: 'Constructor',
                        name: 'MyClass',
                        analysis: 1,
                        location: { start: 828, end: 904 },
                        parameters: []
                    },
                    methods:
                    [{
                        type: 'Method',
                        name: 'myMethod',
                        analysis: 1,
                        location: { start: 913, end: 962 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'par1',
                            analysis: 1,
                            location: { start: 952, end: 956 },
                            decorators:
                            [{
                                type: 'Decorator',
                                name: 'decoOne',
                                analysis: 1,
                                location: { start: 1060, end: 1089 },
                                parameters: []
                            }]
                        }],
                        decorators:
                        [{
                            type: 'Decorator',
                            name: 'decoOne',
                            analysis: 1,
                            location: { start: 1041, end: 1050 },
                            parameters: []
                        }]
                    }],
                    decorators:
                    [{
                        type: 'Decorator',
                        name: 'decoTwo',
                        analysis: 1,
                        location: { start: 1347, end: 1362 },
                        parameters: [{ type: 'String', value: 'halo' }]
                    }]
                }],
                location: { start: 492, end: 1524 },
                name: 'MyModule'
            }])
        })

        it("Should transform TypeScript (4.5 MB) file in less than 1 second", function () {
            this.timeout(10000)
            let filename = "./node_modules/typescript/lib/typescript.js"
            let code = Fs.readFileSync(Path.join(process.cwd(), filename)).toString()
            let dummy = new Transformer(filename, "ASTree");
            let ast = Babylon.parse(code);
            let start = new Date()
            let result = dummy.transform(ast);
            let end = new Date();
            let gap = end.getTime() - start.getTime();
            console.log("EXEC TIME: " + gap)
            Chai.expect(gap).lessThan(1000)
        })
    })
})