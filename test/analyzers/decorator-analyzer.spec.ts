import { AnalysisType, MetaData } from "../../src/core"
import * as Analyzer from "../../src/analyzers"
import { JsParser, parsers } from "../helper"
import * as Chai from "chai"

for (let parser of parsers) {
    describe(`Method Decorator Analyzer using ${parser}`, () => {
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
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.isMethodDecorator()).eq(true);
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
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.isMethodDecorator()).eq(true);
            })
        })

        describe("getClassName", () => {
            it("Should return class name from Method Decorator properly", () => {
                let ast = JsParser.getAst(`
                    tslib_1.__decorate([
                        decoOne(),
                        decoTwo("hello world!"),
                        tslib_1.__metadata("design:type", Function),
                        tslib_1.__metadata("design:paramtypes", []),
                        tslib_1.__metadata("design:returntype", void 0)
                    ], MyClass.prototype, "myMethod", null);
                `)
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.getClassName()).eq("MyClass");
            })

            it("Should get className from Class Decorator properly", () => {
                let ast = JsParser.getAst(`
                    MyClass = tslib_1.__decorate([
                        decoOne(),
                        tslib_1.__metadata("design:paramtypes", [])
                    ], MyClass);
                `)
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.getClassName()).eq("MyClass");
            })

            it("getClassName() Should not error when supplied other syntax", () => {
                        let ast = JsParser.getAst(`
                    $(function(){})
                `)
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.getClassName()).null;
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
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.getMethodName()).eq("myMethod");
            })

            it("Should not error when provided different syntax", () => {
                let ast = JsParser.getAst(`
                    var MyClass = null
                `)
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.getMethodName()).null
            })
        })

        describe("isClassDecorator", () => {
            it("Should identify decorator properly", () => {
                let ast = JsParser.getAst(`
                    MyClass = tslib_1.__decorate([
                        decoOne(),
                        tslib_1.__metadata("design:paramtypes", [])
                    ], MyClass);
                `)
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.isClassDecorator()).eq(true);
            })

            it("Should identify decorator without tslib properly", () => {
                let ast = JsParser.getAst(`
                    MyClass = __decorate([
                        decoOne(),
                        __metadata("design:paramtypes", [])
                    ], MyClass);
                `)
                let dummy = <Analyzer.DecoratorAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Decorator, ast)
                Chai.expect(dummy.isClassDecorator()).eq(true);
            })
        })
    })
}