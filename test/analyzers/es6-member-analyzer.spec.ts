import { AnalysisType, MetaData } from "../../src/core"
import * as Analyzer from "../../src/analyzers"
import { JsParser, parsers } from "../helper"
import * as Chai from "chai"

for (let parser of parsers) {

    describe(`Es6 Member Analyzer using ${parser}`, () => {
        it("Should identify constructor candidate", () => {
            let ast = JsParser.getAst(`
                class MyClass extends Module.MyClass {
                    constructor(par1) { super(); }
                    myMethod() { }
                }
            `)
            let dummy = <Analyzer.Es6MemberAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Es6ClassMember, ast.body.body[0])
            Chai.expect(dummy.isCandidate()).true;
            Chai.expect(dummy.getType()).eq("Constructor")
        })

        it("Should identify method candidate", () => {
            let ast = JsParser.getAst(`
                class MyClass extends Module.MyClass {
                    constructor(par1) { super(); }
                    myMethod() { }
                }
            `)
            let dummy = <Analyzer.Es6MemberAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Es6ClassMember, ast.body.body[1])
            Chai.expect(dummy.isCandidate()).true;
            Chai.expect(dummy.getType()).eq("Method")
        })

        it("Should able to provide parameters", () => {
            let ast = JsParser.getAst(`
                class MyClass extends Module.MyClass {
                    constructor(par1) { super(); }
                    myMethod() { }
                }
            `)
            let dummy = <Analyzer.Es6MemberAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Es6ClassMember, ast.body.body[0])
            Chai.expect(dummy.getParameters().length).eq(1)
        })

        it("Should able to provide location", () => {
            let ast = JsParser.getAst(`
                class MyClass extends Module.MyClass {
                    constructor(par1) { super(); }
                    myMethod() { }
                }
            `)
            let dummy = <Analyzer.Es6MemberAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Es6ClassMember, ast.body.body[0])
            Chai.expect(dummy.getLocation()).not.null
        })

        it("Should able to provide location", () => {
            let ast = JsParser.getAst(`
                class MyClass extends Module.MyClass {
                    constructor(par1) { super(); }
                    myMethod() { }
                }
            `)
            let dummy = <Analyzer.Es6MemberAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Es6ClassMember, ast.body.body[1])
            Chai.expect(dummy.getName()).eq("myMethod")
        })
    })
}