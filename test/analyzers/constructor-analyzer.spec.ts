import { AnalysisType, MetaData } from "../../src/core"
import { ConstructorAnalyzer } from "../../src/analyzers/constructor-analyser"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("Class Analyzer", () => {
    it("Should return class name properly", () => {
        let ast = JsParser.getAst(`function MyClass(){}`)
        let dummy = new ConstructorAnalyzer(ast)
        Chai.expect(dummy.getName()).eq("MyClass");
    })

    it("Should identify constructor properly", () => {
        let ast = JsParser.getAst(`function MyClass(){}`)
        let dummy = new ConstructorAnalyzer(ast)
        Chai.expect(dummy.isConstructor("MyClass")).eq(true);
        Chai.expect(dummy.getParameters().length).eq(0);
    })

    it("Should identify constructor properly", () => {
        let ast = JsParser.getAst(`function MyClass(par1, par2){ }`)
        let dummy = new ConstructorAnalyzer(ast)
        Chai.expect(dummy.getParameters().length).eq(2);
    })
})