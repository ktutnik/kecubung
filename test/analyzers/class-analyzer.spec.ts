import { AnalysisType, MetaData } from "../../src/core"
import { ClassAnalyzer } from "../../src/analyzers/class-analyzer"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("Class Analyzer", () => {
    describe("isExported", () => {
        it("Should identify exported class with module", () => {
            let ast = JsParser.getAst(`MyModule.MyClass = MyClass`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.isExported("MyClass", "MyModule")).eq(true);
            Chai.expect(dummy.getName()).eq("MyClass");
            Chai.expect(dummy.getParentName()).eq("MyModule");
        })

        it("Should identify exported class", () => {
            let ast = JsParser.getAst(`exports.MyClass = MyClass`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.isExported("MyClass", "MyModule")).eq(true);
            Chai.expect(dummy.getName()).eq("MyClass");
            Chai.expect(dummy.getParentName()).eq("exports");
        })
    })

    describe("isCandidate", () => {
        it("Should identify class candidate", () => {
            let ast = JsParser.getAst(`
            var MyClass = (function () {
            }());`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.isCandidate()).true;
            Chai.expect(dummy.getName()).eq("MyClass");
        })

        it("Should identify class candidate with inheritance", () => {
            let ast = JsParser.getAst(`
            var MyClass = (function (_super) {
            }(BaseClass));`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.isCandidate()).true;
            Chai.expect(dummy.getName()).eq("MyClass");
        })
    })

    describe("getName", () => {
        it("Should return class name properly", () => {
            let ast = JsParser.getAst(`
            var MyClass = (function () {
            }());`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.getName()).eq("MyClass");
        })

        it("Should not error on any syntax", () => {
            let ast = JsParser.getAst(`
            var MyClass = null`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.getName()).null;
        })
    })

    describe("getBaseClass", () => {
        it("Should return base class name properly", () => {
            let ast = JsParser.getAst(`
            var MyClass = (function (_super) {
            }(MyBaseClass));`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.getBaseClass()).eq("MyBaseClass");
        })

        it("Should return base class name with module", () => {
            let ast = JsParser.getAst(`
            var MyClass = (function (_super) {
            }(MyModule.MyBaseClass));`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.getBaseClass()).eq("MyBaseClass");
        })

        it("Should not error on class that has no base class", () => {
            let ast = JsParser.getAst(`
            var MyClass = (function () {
            }());`)
            let dummy = new ClassAnalyzer(ast)
            Chai.expect(dummy.getBaseClass()).null;
        })
    })
})