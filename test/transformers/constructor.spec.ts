import * as Core from "../../src/core"
import { ConstructorTransformer } from "../../src/transformers/constructor"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("ConstructorTransformer", () => {

    it("Should identify method properly", () => {
        let ast = JsParser.getAst(`
        function MyClass(par1) { };
        `)
        let dummy = new ConstructorTransformer("ASTree");
        let parent = <Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
        }
        dummy.transform(ast, parent);
        Chai.expect(parent.constructor).deep.eq(<Core.ConstructorMetaData>{
            type: "Constructor",
            name: "MyClass",
            analysis: Core.AnalysisType.Valid,
            location: {
                start: 9, end: 35
            },
            parameters: [<Core.ParameterMetaData>{
                type: "Parameter",
                name: "par1",
                location: {
                    start: 26, end: 30
                },
                analysis: Core.AnalysisType.Valid,
            }]
        })
    })
})