import { AnalysisType, MetaData, SyntaxKind } from "../../src/core"
import * as Helper from "../../src/analyzers/helper"
import { JsParser } from "../helper"
import * as Chai from "chai"

describe("Analyzer helper", () => {
    describe("getMethodNameFromCallee", () => {
        it("Should return method name with member access", () => {
            let ast = JsParser.getAst(`tslib.__decorate()`)
            let result = Helper.getMethodNameFromCallee(ast.expression.callee)
            Chai.expect(result).eq("__decorate");
        })
        it("Should return method name", () => {
            let ast = JsParser.getAst(`__decorate()`)
            let result = Helper.getMethodNameFromCallee(ast.expression.callee)
            Chai.expect(result).eq("__decorate");
        })
    })

    describe("isReservedDecorator", () => {
        it("Should identify tslib __decorate decorator", () => {
            let ast = JsParser.getAst(`tslib.__decorate()`)
            let result = Helper.isReservedDecorator(ast.expression)
            Chai.expect(result).eq(true);
        })
        it("Should identify tslib __param decorator", () => {
            let ast = JsParser.getAst(`tslib.__param()`)
            let result = Helper.isReservedDecorator(ast.expression)
            Chai.expect(result).eq(true);
        })
        it("Should identify tslib __metadata decorator", () => {
            let ast = JsParser.getAst(`tslib.__metadata()`)
            let result = Helper.isReservedDecorator(ast.expression)
            Chai.expect(result).eq(true);
        })
    })


})