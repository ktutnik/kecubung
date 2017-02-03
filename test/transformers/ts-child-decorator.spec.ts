import * as Core from "../../src/core"
import { TsChildDecoratorTransformer } from "../../src/transformers/ts-child-decorator"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("TsChildDecoratorTransformer", () => {

    it("Should identify parameter decorator properly", () => {
        let ast = JsParser.getAst(`tslib_1.__param(0, decoOne("param"))`)
        let dummy = new TsChildDecoratorTransformer("ASTree");
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
                start: 0, end: 36
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 0, end: 36
                }
            }]
        });
    })

    it("Should identify parameter decorator if provided variable", () => {
        let ast = JsParser.getAst(`tslib_1.__param(0, decoOne(variableValue))`)
        let dummy = new TsChildDecoratorTransformer("ASTree");
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
        Chai.expect(parent.parameters[0].decorators[0].parameters[0].name).eq("variableValue")
    })

    it("Should return 'Unknown' if the parameter is method call", () => {
        let ast = JsParser.getAst(`tslib_1.__param(0, decoOne(method()))`)
        let dummy = new TsChildDecoratorTransformer("ASTree");
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
        Chai.expect(parent.parameters[0].decorators[0].parameters[0].name).eq("Unknown")
    })

    it("Should merge existing parameter decorator", () => {
        let ast = JsParser.getAst(`tslib_1.__param(0, decoOne("param"))`)
        let dummy = new TsChildDecoratorTransformer("ASTree");
        let parent = <Core.MethodMetaData>{
            type: "Method",
            name: "myMethod",
            analysis: Core.AnalysisType.Valid,
            parameters: [<Core.ParameterMetaData>{
                decorators: [<Core.DecoratorMetaData>{
                    type: "Decorator",
                    name: "justName",
                    parameters: []
                }],
                type: "Parameter",
                name: "par1"
            }]
        }
        dummy.transform(ast.expression, parent);
        Chai.expect(parent.parameters[0].decorators[1]).deep.eq(<Core.DecoratorMetaData>{
            type: "Decorator",
            name: "decoOne",
            analysis: Core.AnalysisType.Valid,
            location: {
                start: 0, end: 36
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 0, end: 36
                }
            }]
        });
    })

    it("Should identify method decorator properly", () => {
        let ast = JsParser.getAst(`decoOne("param")`)
        let dummy = new TsChildDecoratorTransformer("ASTree");
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
                start: 0, end: 16
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 0, end: 16
                }
            }]
        });
    })

    it("Should merge with existing method decorator", () => {
        let ast = JsParser.getAst(`decoOne("param")`)
        let dummy = new TsChildDecoratorTransformer("ASTree");
        let parent = <Core.MethodMetaData>{
            decorators: [<Core.DecoratorMetaData>{
                type: "Decorator",
                name: "justName",
                parameters: []
            }],
            type: "Method",
            name: "myMethod",
            analysis: Core.AnalysisType.Valid,
            parameters: [<Core.ParameterMetaData>{
                type: "Parameter",
                name: "par1"
            }]
        }
        dummy.transform(ast.expression, parent);
        Chai.expect(parent.decorators[1]).deep.eq(<Core.DecoratorMetaData>{
            type: "Decorator",
            name: "decoOne",
            analysis: Core.AnalysisType.Valid,
            location: {
                start: 0, end: 16
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 0, end: 16
                }
            }]
        });
    })

    it("Should identify method decorator with member access", () => {
        let ast = JsParser.getAst(`theModule.decoOne("param")`)
        let dummy = new TsChildDecoratorTransformer("ASTree");
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
                start: 0, end: 26
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 0, end: 26
                }
            }]
        });
    })

    it("Should not error if provided __metadata", () => {
        let ast = JsParser.getAst(`tslib_1.__metadata("design:type", Function)`)
        let dummy = new TsChildDecoratorTransformer("ASTree");
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