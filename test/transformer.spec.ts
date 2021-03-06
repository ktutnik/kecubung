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
            Chai.expect(result.children[0]).deep.property("children[0].name", "MyBaseClass")
            Chai.expect(result.children[0]).deep.property("children[1].name", "MyClass")
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

        it("Should transform ES6 class with namespaces properly", () => {
            let ast = JsParser.getAst(`
                var Module;
                (function (Module) {
                    class MyClass {
                        myMethod() { }
                    }
                    Module.MyClass = MyClass;
                })(Module || (Module = {}));
                class MyClass extends Module.MyClass {
                    constructor(par1) { super(); }
                    myMethod() { }
                }
                exports.MyClass = MyClass;
            `, true)
            let test = new Transformer("file.js", "ASTree")
            let result = test.transform(ast)
            Chai.expect(result).deep.eq({
                type: 'File',
                name: 'file.js',
                analysis: 1,
                children:
                [{
                    type: 'Module',
                    analysis: 66,
                    children:
                    [{
                        type: 'Class',
                        name: 'MyClass',
                        baseClass: undefined,
                        location: { start: 86, end: 162 },
                        analysis: 31,
                        methods:
                        [{
                            type: 'Method',
                            name: 'myMethod',
                            analysis: 1,
                            location: { start: 126, end: 140 },
                            parameters: [],
                            decorators: undefined
                        }]
                    }],
                    location: { start: 45, end: 253 },
                    name: 'Module'
                },
                {
                    type: 'Class',
                    name: 'MyClass',
                    baseClass: 'MyClass',
                    location: { start: 270, end: 412 },
                    analysis: 31,
                    methods:
                    [{
                        type: 'Method',
                        name: 'myMethod',
                        analysis: 1,
                        location: { start: 380, end: 394 },
                        parameters: [],
                        decorators: undefined
                    }],
                    constructor:
                    {
                        type: 'Constructor',
                        name: 'constructor',
                        analysis: 1,
                        location: { start: 329, end: 359 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'par1',
                            analysis: 1,
                            location: { start: 341, end: 345 }
                        }],
                        decorators: undefined
                    }
                }],
                location: { start: 0, end: 468 }
            })
        })

        it("Should transform ES6 class with decorator properly", () => {
            let ast = JsParser.getAst(`
            let CategoryProductController = class CategoryProductController extends kamboja_1.ApiController {
                constructor() {
                    super(...arguments);
                }
                get(id, categoryId) { }
            };
            CategoryProductController = __decorate([
                kamboja_1.http.root("/categories/:categoryId/products")
            ], CategoryProductController);
            exports.CategoryProductController = CategoryProductController;
            `, true)

            let test = new Transformer("file.js", "ASTree")
            let result = test.transform(ast)
            Chai.expect(result).deep.eq({
                type: 'File',
                name: 'file.js',
                analysis: 1,
                children:
                [{
                    type: 'Class',
                    name: 'CategoryProductController',
                    baseClass: 'ApiController',
                    location: { start: 13, end: 256 },
                    analysis: 31,
                    methods:
                    [{
                        type: 'Method',
                        name: 'get',
                        analysis: 1,
                        location: { start: 218, end: 241 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'id',
                            analysis: 1,
                            location: { start: 222, end: 224 }
                        },
                        {
                            type: 'Parameter',
                            name: 'categoryId',
                            analysis: 1,
                            location: { start: 226, end: 236 }
                        }],
                        decorators: undefined
                    }],
                    constructor:
                    {
                        type: 'Constructor',
                        name: 'constructor',
                        analysis: 1,
                        location: { start: 127, end: 201 },
                        parameters: [],
                        decorators: undefined
                    },
                    decorators:
                    [{
                        type: 'Decorator',
                        name: 'root',
                        analysis: 1,
                        location: { start: 326, end: 381 },
                        parameters: [{ type: 'String', value: '/categories/:categoryId/products' }]
                    }]
                }],
                location: { start: 0, end: 512 }
            })
        })

        it("Should transform ES6 class with default parameter", () => {
            let ast = JsParser.getAst(`
                class MyClass {
                    constructor(par1, par2 = 300){}
                    myMethod(par1, par2 = 50) { }
                }
                exports.MyClass = MyClass;
            `, true)
            let test = new Transformer("file.js", "ASTree")
            let result = test.transform(ast)
            Chai.expect(result).deep.eq({
                type: 'File',
                name: 'file.js',
                analysis: 1,
                children:
                [{
                    type: 'Class',
                    name: 'MyClass',
                    baseClass: undefined,
                    location: { start: 17, end: 152 },
                    analysis: 31,
                    methods:
                    [{
                        type: 'Method',
                        name: 'myMethod',
                        analysis: 1,
                        location: { start: 105, end: 134 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'par1',
                            analysis: 1,
                            location: { start: 114, end: 118 }
                        },
                        {
                            type: 'Parameter',
                            name: 'par2',
                            analysis: 1,
                            location: { start: 120, end: 129 }
                        }],
                        decorators: undefined
                    }],
                    constructor:
                    {
                        type: 'Constructor',
                        name: 'constructor',
                        analysis: 1,
                        location: { start: 53, end: 84 },
                        parameters:
                        [{
                            type: 'Parameter',
                            name: 'par1',
                            analysis: 1,
                            location: { start: 65, end: 69 }
                        },
                        {
                            type: 'Parameter',
                            name: 'par2',
                            analysis: 1,
                            location: { start: 71, end: 81 }
                        }],
                        decorators: undefined
                    }
                }],
                location: { start: 0, end: 208 }
            })
        })
    })
})