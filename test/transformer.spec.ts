import { Transformer } from "../src/transformer"
import { VisitorRegistry } from "../src/visitors"
import { JsParser, MH } from "./helper"
import { flag, AnalysisType, MetaDataFactory } from "../src/core"
import * as Chai from "chai"

describe("Transformer", () => {
    it("Should transform class properly", () => {
        let ast = JsParser.getAst(`
            var MyClass = (function () {
                function MyClass(par1, par2) {
                }
                MyClass.prototype.myMethod = function (par1, par2) { };
                return MyClass;
            }());
            exports.MyClass = MyClass;`, true)
        let test = new Transformer(VisitorRegistry.getVisitor(new MetaDataFactory()));
        let result = test.transform(ast, "");
        //verify the root result is valid
        Chai.expect(MH.validate(result, null, [AnalysisType.Valid])).true
        //verify the class is valid
        Chai.expect(MH.validateClass(result.children[0], {
            name: "MyClass",
            constructorParams: ["par1", "par2"],
            methods: [
                {
                    name: "myMethod",
                    params: ["par1", "par2"]
                }],
            flags: [AnalysisType.Valid,
                AnalysisType.HasMethod,
                AnalysisType.HasConstructor,
                AnalysisType.Exported]
        })).true;
    })

    it("Should transform class with module properly", () => {
        let ast = JsParser.getAst(`
            var MyModule;
            (function (MyModule) {
                var MyClass = (function () {
                    function MyClass() {
                    }
                    MyClass.prototype.myMethod = function (par1, par2) { };
                    return MyClass;
                }());
                MyModule.MyClass = MyClass;
            })(MyModule = exports.MyModule || (exports.MyModule = {}));`, true)
        let test = new Transformer(VisitorRegistry.getVisitor(new MetaDataFactory()));
        let result = test.transform(ast, "");
        //verify the root result is valid
        Chai.expect(MH.validate(result, null, [AnalysisType.Valid])).true
        //verify the module is valid
        Chai.expect(MH.validate(result.children[0], { type: "Module", name: "MyModule" },
            [AnalysisType.Valid, AnalysisType.ConnectedWithChildren, AnalysisType.Exported])).true
        //verify the class is valid
        Chai.expect(MH.validateClass(result.children[0].children[0], {
            name: "MyClass",
            methods: [
                {
                    name: "myMethod",
                    params: ["par1", "par2"]
                }],
            flags: [AnalysisType.Valid, AnalysisType.HasMethod, AnalysisType.HasConstructor]
        })).true;
    })

    it("Should identify non exported children", () => {
        let ast = JsParser.getAst(`
            var MyModule;
            (function (MyModule) {
                var MyClass = (function () {
                    function MyClass() {
                    }
                    MyClass.prototype.myMethod = function (par1, par2) { };
                    return MyClass;
                }()); //<------- MyClass is not exported
            })(MyModule = exports.MyModule || (exports.MyModule = {}));`, true)
        let test = new Transformer(VisitorRegistry.getVisitor(new MetaDataFactory()));
        let result = test.transform(ast, "");
        //verify root result is not valid
        Chai.expect(flag(result.analysis, AnalysisType.Valid)).eq(false)
        //verify the module also is not valid
        Chai.expect(flag(result.children[0].analysis, AnalysisType.Valid)).false;
        //verify the module is not connected with children
        Chai.expect(flag(result.children[0].analysis, AnalysisType.ConnectedWithChildren)).false;
        //verify the class is not valid
        Chai.expect(flag(result.children[0].children[0].analysis, AnalysisType.Valid)).false;
        //verify the class is not exported
        Chai.expect(flag(result.children[0].children[0].analysis, AnalysisType.Exported)).false;
    })

    it("Should identify decorator properly", () => {
        let ast = JsParser.getAst(`
            var MyClass = (function () {
                function MyClass() {
                }
                MyClass.prototype.myMethod = function (par1) { };
                return MyClass;
            }());
            tslib_1.__decorate([
                decoOne(),
                tslib_1.__param(0, decoOne())
            ], MyClass.prototype, "myMethod", null);
            MyClass = tslib_1.__decorate([
                decoOne(),
                decoTwo("hello world!")
            ], MyClass);`, true)
        let test = new Transformer(VisitorRegistry.getVisitor(new MetaDataFactory()));
        let result = test.transform(ast, "");
        Chai.expect(result.children[0].decorators.length).eq(2);
        //verify class decorator 1
        Chai.expect(MH.validate(result.children[0].decorators[0], { type: "Decorator", name: "decoOne" }, null)).true
        //verify class decorator 2
        Chai.expect(MH.validate(result.children[0].decorators[1], { type: "Decorator", name: "decoTwo" }, null)).true
        //verify class decoartor 2 parameter
        Chai.expect(MH.validate(result.children[0].decorators[1].children[0], { type: "Parameter", name: "hello world!" }, null)).true
        //verify method decorator
        Chai.expect(MH.validate(result.children[0].children[1].decorators[0], { type: "Decorator", name: "decoOne" }, null)).true
        //verify parameter decorator
        Chai.expect(MH.validate(result.children[0].children[1].children[0].decorators[0], { type: "Decorator", name: "decoOne" }, null)).true
    })

    it("Should transform ES6 class properly", () => {
        let ast = JsParser.getAst(`
            let MyClass = class MyClass {
                constructor(par1, par2) { }
                myMethod(par1, par2) { }
            };
            exports.MyClass = MyClass;`, true)
        let test = new Transformer(VisitorRegistry.getVisitor(new MetaDataFactory()));
        let result = test.transform(ast, "");
        //verify the root result is valid
        Chai.expect(MH.validate(result, null, [AnalysisType.Valid])).true
        //verify the class is valid
        Chai.expect(MH.validateClass(result.children[0], {
            name: "MyClass",
            constructorParams: ["par1", "par2"],
            methods: [
                {
                    name: "myMethod",
                    params: ["par1", "par2"]
                }],
            flags: [AnalysisType.Valid, AnalysisType.HasMethod, AnalysisType.HasConstructor, AnalysisType.Exported]
        })).true;
    })
})