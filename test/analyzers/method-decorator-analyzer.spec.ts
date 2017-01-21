import { AnalysisType, MetaData } from "../../src/core"
import { MethodDecoratorAnalyzer } from "../../src/analyzers/method-decorator-analyzer"
import { JsParser, MH } from "../helper"
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

    describe("getDecorators", () => {
        it("Should return decorator properly", () => {
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
            let result = dummy.getDecorators();
            Chai.expect(MH.validate(result[0], { type: "Decorator", name: "decoOne" }, null)).eq(true);
            Chai.expect(MH.validate(result[1], { type: "Decorator", name: "decoTwo" }, null)).eq(true);
            Chai.expect(MH.validate(result[1].children[0], { type: "Parameter", name: "hello world!" }, null)).eq(true);
        })

        it("Should not error when provided different syntax", () => {
            let ast = JsParser.getAst(`
                var MyClass = null
            `)
            let dummy = new MethodDecoratorAnalyzer(ast)
            let result = dummy.getDecorators();
            Chai.expect(result).null
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

    describe("getParameters", () => {
        it("Should return parameter decorators properly", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    tslib_1.__param(0, decoOne()),
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            let result = dummy.getParameters(0)
            Chai.expect(MH.validate(result[0], { type: "Decorator", name: "decoOne" }, null)).eq(true);
        })

        it("Should not error when provided different syntax", () => {
            let ast = JsParser.getAst(`
                var MyClass = null
            `)
            let dummy = new MethodDecoratorAnalyzer(ast)
            Chai.expect(dummy.getParameters(0)).null
        })

        it("Should return parameter decorators with parameter properly", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    tslib_1.__param(0, decoOne("hello world!")),
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            let result = dummy.getParameters(0)
            Chai.expect(MH.validate(result[0].children[0], { type: "Parameter", name: "hello world!" }, null)).eq(true);
        })

        it("Should return parameter decorators with identifier parameter properly", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    tslib_1.__param(0, decoOne(MyClass)),
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            let result = dummy.getParameters(0)
            Chai.expect(MH.validate(result[0].children[0], { type: "Parameter", name: "MyClass" }, null)).eq(true);
        })

        it("Should return parameter decorators with numeric parameter properly", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    tslib_1.__param(0, decoOne(200)),
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            let result = dummy.getParameters(0)
            Chai.expect(MH.validate(result[0].children[0], { type: "Parameter", name: 200 }, null)).eq(true);
        })

        it("Should return parameter decorators with boolean parameter properly", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    tslib_1.__param(0, decoOne(false)),
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            let result = dummy.getParameters(0)
            Chai.expect(MH.validate(result[0].children[0], { type: "Parameter", name: false }, null)).eq(true);
        })

        it("Should not error when supplied with function call", () => {
            let ast = JsParser.getAst(`
                tslib_1.__decorate([
                    decoOne(),
                    tslib_1.__param(0, decoOne(myFunction())),
                ], MyClass.prototype, "myMethod", null);
            `)
            let dummy = new MethodDecoratorAnalyzer(ast.expression)
            let result = dummy.getParameters(0)
            Chai.expect(MH.validate(result[0].children[0], { type: "Parameter", name: "Unknown" }, null)).eq(true);
        })
    })
})