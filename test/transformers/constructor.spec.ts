import * as Core from "../../src/core"
import { ConstructorTransformer } from "../../src/transformers/constructor"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("ConstructorTransformer", () => {

    it("Should identify method properly", () => {
        let ast = JsParser.getAst(`
        function MyClass(par1) { };
        `)
        let dummy = new ConstructorTransformer();
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
                column: 8, line: 2
            },
            parameters: [<Core.ParameterMetaData>{
                type: "Parameter",
                name: "par1",
                location: {
                    column: 25, line: 2
                },
                analysis: Core.AnalysisType.Valid,
            }]
        })
    })
})