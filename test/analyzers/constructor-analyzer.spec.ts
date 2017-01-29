import { AnalysisType, MetaData } from "../../src/core"
import * as Analyzer from "../../src/analyzers"
import { JsParser, parsers } from "../helper"
import * as Chai from "chai"

for (let parser of parsers) {
    describe(`Class Analyzer using ${parser}`, () => {
        it("Should return class name properly", () => {
            let ast = JsParser.getAst(`function MyClass(){}`)
            let dummy = <Analyzer.ConstructorAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Constructor, ast)
            Chai.expect(dummy.getName()).eq("MyClass");
        })

        it("Should identify constructor properly", () => {
            let ast = JsParser.getAst(`function MyClass(){}`)
            let dummy = <Analyzer.ConstructorAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Constructor, ast)
            Chai.expect(dummy.isConstructor("MyClass")).eq(true);
            Chai.expect(dummy.getParameters().length).eq(0);
        })

        it("Should identify constructor properly", () => {
            let ast = JsParser.getAst(`function MyClass(par1, par2){ }`)
            let dummy = <Analyzer.ConstructorAnalyzer>Analyzer
                .get(parser, Analyzer.AnalyzerType.Constructor, ast)
            Chai.expect(dummy.getParameters().length).eq(2);
        })
    })
}