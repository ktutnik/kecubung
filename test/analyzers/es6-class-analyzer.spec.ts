import { AnalysisType, MetaData } from "../../src/core"
import * as Analyzer from "../../src/analyzers"
import { JsParser, parsers } from "../helper"
import * as Chai from "chai"

for (let parser of parsers) {
    describe(`Es6ClassAnalyzer using ${parser}`, () => {

        describe("isCandidate", () => {
            it("Should identify class candidate", () => {
                let ast = JsParser.getAst(`
                    class MyClass extends Module.MyClass {
                        constructor(par1) { super(); }
                        myMethod() { }
                    }
                `)
                let dummy = <Analyzer.ClassAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Es6Class, ast)
                Chai.expect(dummy.isCandidate()).true;
            })

            it("Should identify class candidate with inheritance", () => {
                let ast = JsParser.getAst(`
                    class MyClass extends Module.MyClass {
                        constructor(par1) { super(); }
                        myMethod() { }
                    }
                `)
                let dummy = <Analyzer.ClassAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Es6Class, ast)
                Chai.expect(dummy.isCandidate()).true;
            })
        })

        describe("getName", () => {
            it("Should return base class name properly", () => {
                let ast = JsParser.getAst(`
                    class MyClass extends Module.MyClass {
                        constructor(par1) { super(); }
                        myMethod() { }
                    }
                `)
                let dummy = <Analyzer.ClassAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Es6Class, ast)
                Chai.expect(dummy.getName()).eq("MyClass");
            })
        })

        describe("getBaseClass", () => {
            it("Should return base class name properly", () => {
                let ast = JsParser.getAst(`
                    class MyClass extends MyBaseClass {
                        constructor(par1) { super(); }
                        myMethod() { }
                    }
                `)
                let dummy = <Analyzer.ClassAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Es6Class, ast)
                Chai.expect(dummy.getBaseClass()).eq("MyBaseClass");
            })

            it("Should return base class name with namespace properly", () => {
                let ast = JsParser.getAst(`
                    class MyClass extends Module.MyBaseClass {
                        constructor(par1) { super(); }
                        myMethod() { }
                    }
                `)
                let dummy = <Analyzer.ClassAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Es6Class, ast)
                Chai.expect(dummy.getBaseClass()).eq("MyBaseClass");
            })
        })

        describe("getMember", () => {
            it("Should provide members properly", () => {
                let ast = JsParser.getAst(`
                    class MyClass extends Module.MyBaseClass {
                        constructor(par1) { super(); }
                        myMethod() { }
                    }
                `)
                let dummy = <Analyzer.ClassAnalyzer>Analyzer
                    .get(parser, Analyzer.AnalyzerType.Es6Class, ast)
                Chai.expect(dummy.getMember().length).eq(2);
            })

        })
    })
}

