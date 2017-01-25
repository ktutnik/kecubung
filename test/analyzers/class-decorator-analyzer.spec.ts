import { AnalysisType, MetaData } from "../../src/core"
import { ClassDecoratorAnalyzer } from "../../src/analyzers/class-decorator-analyzer"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("Class Decorator Analyzer", () => {
    describe("isDecorator", () => {
        it("Should identify decorator properly", () => {
            let ast = JsParser.getAst(`
            MyClass = tslib_1.__decorate([
                decoOne(),
                tslib_1.__metadata("design:paramtypes", [])
            ], MyClass);
        `)
            let dummy = new ClassDecoratorAnalyzer(ast)
            Chai.expect(dummy.isDecorator()).eq(true);
        })

        it("Should identify decorator without tslib properly", () => {
            let ast = JsParser.getAst(`
            MyClass = __decorate([
                decoOne(),
                __metadata("design:paramtypes", [])
            ], MyClass);
        `)
            let dummy = new ClassDecoratorAnalyzer(ast)
            Chai.expect(dummy.isDecorator()).eq(true);
        })
    })

    describe("getClassName", () => {
        it("Should get className properly", () => {
            let ast = JsParser.getAst(`
            MyClass = tslib_1.__decorate([
                decoOne(),
                tslib_1.__metadata("design:paramtypes", [])
            ], MyClass);
        `)
            let dummy = new ClassDecoratorAnalyzer(ast)
            Chai.expect(dummy.getClassName()).eq("MyClass");
        })

        it("getClassName() Should not error when supplied other syntax", () => {
            let ast = JsParser.getAst(`
            $(function(){})
        `)
            let dummy = new ClassDecoratorAnalyzer(ast)
            Chai.expect(dummy.getClassName()).null;
        })
    })
})