import * as Core from "../../src/core"
import { TsChildDecorator } from "../../src/transformers/ts-child-decorator"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("TsChildDecorator", () => {

    it("Should identify parameter decorator properly", () => {
        let ast = JsParser.getAst(`tslib_1.__param(0, decoOne("param"))`)
        let dummy = new TsChildDecorator();
        let parent = <Core.MethodMetaData>{
            type: "Method",
            name: "myMethod",
            analysis: Core.AnalysisType.Valid,
            parameters: [<Core.ParameterMetaData>{
                type: "Parameter",
                name: "par1"
            }]
        }
        dummy.transform(ast.expression, parent);
        Chai.expect(parent.parameters[0].decorators[0]).deep.eq(<Core.DecoratorMetaData>{
            type: "Decorator",
            name: "decoOne",
            analysis: Core.AnalysisType.Valid,
            location: {
                column: 0, line: 1
            },
            parameters: [<Core.MetaData>{
                type:"Parameter",
                name:"param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    column: 27, line: 1
                }
            }]
        });
    })

    it("Should identify method decorator properly", () => {
        let ast = JsParser.getAst(`decoOne("param")`)
        let dummy = new TsChildDecorator();
        let parent = <Core.MethodMetaData>{
            type: "Method",
            name: "myMethod",
            analysis: Core.AnalysisType.Valid,
            parameters: [<Core.ParameterMetaData>{
                type: "Parameter",
                name: "par1"
            }]
        }
        dummy.transform(ast.expression, parent);
        Chai.expect(parent.decorators[0]).deep.eq(<Core.DecoratorMetaData>{
            type: "Decorator",
            name: "decoOne",
            analysis: Core.AnalysisType.Valid,
            location: {
                column: 0, line: 1
            },
            parameters: [<Core.MetaData>{
                type:"Parameter",
                name:"param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    column: 8, line: 1
                }
            }]
        });
    })

    it("Should not error if provided __metadata", () => {
        let ast = JsParser.getAst(`tslib_1.__metadata("design:type", Function)`)
        let dummy = new TsChildDecorator();
        let parent = <Core.MethodMetaData>{
            type: "Method",
            name: "myMethod",
            analysis: Core.AnalysisType.Valid,
            parameters: [<Core.ParameterMetaData>{
                type: "Parameter",
                name: "par1"
            }]
        }
        dummy.transform(ast.expression, parent);
        Chai.expect(parent.decorators).undefined;
        Chai.expect(parent.parameters[0].decorators).undefined
    })
})