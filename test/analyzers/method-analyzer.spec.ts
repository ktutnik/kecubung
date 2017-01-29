import { AnalysisType, MetaData } from "../../src/core"
import * as Analyzer from "../../src/analyzers"
import { JsParser, parsers } from "../helper"
import * as Chai from "chai"

for (let parser of parsers) {

    describe(`Method Analyzer using ${parser}`, () => {
        it("Should identify method candidate", () => {
            let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(){}`)
            let dummy = <Analyzer.MethodAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Method, ast)
            Chai.expect(dummy.isMethod("MyClass")).true;
        })

        it("Should return method name properly", () => {
            let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(){}`)
            let dummy = <Analyzer.MethodAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Method, ast)
            Chai.expect(dummy.getName()).eq("myMethod");
            Chai.expect(dummy.getParameters().length).eq(0);
        })

        it("Should return parameters properly", () => {
            let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(par1, par2){}`)
            let dummy = <Analyzer.MethodAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Method, ast)
            Chai.expect(dummy.getParameters().length).eq(2);
        })

        it("getName() should not error when supplied different syntax", () => {
            let ast = JsParser.getAst(`var MyClass = null`)
            let dummy = <Analyzer.MethodAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Method, ast)
            Chai.expect(dummy.getName()).null;
        })

        it("Should return class name properly", () => {
            let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(){}`)
            let dummy = <Analyzer.MethodAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Method, ast)
            Chai.expect(dummy.getClassName()).eq("MyClass");
        })

        it("getClassName() should not error when supplied different syntax", () => {
            let ast = JsParser.getAst(`var MyClass = null`)
            let dummy = <Analyzer.MethodAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Method, ast)
            Chai.expect(dummy.getClassName()).null;
        })

        it("Should return method parameters properly", () => {
            let ast = JsParser.getAst(`MyClass.prototype.myMethod = function(par1, par2){}`)
            let dummy = <Analyzer.MethodAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Method, ast)
            let params = dummy.getParams();
            Chai.expect(params[0]).eq("par1");
            Chai.expect(params[1]).eq("par2");
        })

        it("getParams() should not error when supplied different syntax", () => {
            let ast = JsParser.getAst(`var MyClass = null`)
            let dummy = <Analyzer.MethodAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Method, ast)
            Chai.expect(dummy.getParams()).null;
        })


    })
}