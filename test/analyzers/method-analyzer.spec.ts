import { AnalysisType, MetaData } from "../../src/core"
import { MethodAnalyzer } from "../../src/analyzers/method-analyzer"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("Method Analyzer", () => {
    it("Should identify method candidate", () => {
        let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(){}`)
        let dummy = new MethodAnalyzer(ast)
        Chai.expect(dummy.isMethod("MyClass")).true;
    })

    it("Should return method name properly", () => {
        let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(){}`)
        let dummy = new MethodAnalyzer(ast)
        Chai.expect(dummy.getName()).eq("myMethod");
    })

    it("getName() should not error when supplied different syntax", () => {
        let ast = JsParser.getAst(`var MyClass = null`)
        let dummy = new MethodAnalyzer(ast)
        Chai.expect(dummy.getName()).null;
    })

    it("Should return class name properly", () => {
        let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(){}`)
        let dummy = new MethodAnalyzer(ast)
        Chai.expect(dummy.getClassName()).eq("MyClass");
    })

    it("getClassName() should not error when supplied different syntax", () => {
        let ast = JsParser.getAst(`var MyClass = null`)
        let dummy = new MethodAnalyzer(ast)
        Chai.expect(dummy.getClassName()).null;
    })

    it("Should return method parameters properly", () => {
        let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(par1, par2){}`)
        let dummy = new MethodAnalyzer(ast)
        let params = dummy.getParams();
        Chai.expect(params[0]).eq("par1");
        Chai.expect(params[1]).eq("par2");
    })

    it("getParams() should not error when supplied different syntax", () => {
        let ast = JsParser.getAst(`var MyClass = null`)
        let dummy = new MethodAnalyzer(ast)
        Chai.expect(dummy.getParams()).null;
    })
})