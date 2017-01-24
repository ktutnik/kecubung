import { AnalysisType, MetaData } from "../../src/core"
import { MethodDecoratorAnalyzer } from "../../src/analyzers/method-decorator-analyzer"
import { JsParser} from "../helper"
import * as Chai from "chai"


describe("Method Decorator Analyzer", () => {
    describe("isDecorator", () => {
        it("Should identify class decorator", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    decoTwo("hello world!"),
                    tslib_1.__metadata("design:type", Function),
                    tslib_1.__metadata("design:paramtypes", []),
                    tslib_1.__metadata("design:returntype", void 0)
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            Chai.expect(dummy.isDecorator()).eq(true);
        })
        it("Should identify class decorator without tslib", () => {
            let ast = JsParser.getAst(`
                __decorate([
                    decoOne(),
                    decoTwo("hello world!"),
                    __metadata("design:type", Function),
                    __metadata("design:paramtypes", []),
                    __metadata("design:returntype", void 0)
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            Chai.expect(dummy.isDecorator()).eq(true);
        })
    })

    describe("getClassName", () => {
        it("Should return class name properly", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    decoTwo("hello world!"),
                    tslib_1.__metadata("design:type", Function),
                    tslib_1.__metadata("design:paramtypes", []),
                    tslib_1.__metadata("design:returntype", void 0)
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            Chai.expect(dummy.getClassName()).eq("MyClass");
        })

        it("Should not error when provided different syntax", () => {
            let ast = JsParser.getAst(`
                var MyClass = null
            `)
            let dummy = new MethodDecoratorAnalyzer(ast)
            Chai.expect(dummy.getClassName()).null
        })
    })

    describe("getMethodName", () => {
        it("Should return method name properly", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    decoTwo("hello world!"),
                    tslib_1.__metadata("design:type", Function),
                    tslib_1.__metadata("design:paramtypes", []),
                    tslib_1.__metadata("design:returntype", void 0)
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            Chai.expect(dummy.getMethodName()).eq("myMethod");
        })

        it("Should not error when provided different syntax", () => {
            let ast = JsParser.getAst(`
                var MyClass = null
            `)
            let dummy = new MethodDecoratorAnalyzer(ast)
            Chai.expect(dummy.getMethodName()).null
        })
    })

})