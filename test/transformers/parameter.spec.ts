import * as Core from "../../src/core"
import { ParameterTransformer } from "../../src/transformers/parameter"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("ParameterTransformer", () => {

    it("Should identify parameters properly", () => {
        let ast = JsParser.getAst(`function MyFunction(par1, par2){}`)
        let dummy = new ParameterTransformer("ASTree");
        let parent = <Core.MethodMetaData>{
            type: "Method",
            name: "MyMethod",
            analysis: Core.AnalysisType.Valid,
            parameters: []
        }
        dummy.transform(ast.params[0], parent);
        Chai.expect(parent.parameters[0]).deep.eq(<Core.ParameterMetaData>{
            type: "Parameter",
            name: "par1",
            location: {
                start: 20, end: 24
            },
            analysis: Core.AnalysisType.Valid,
        });
    })
})