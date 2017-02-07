import * as Core from "../../src/core"
import { TsDecorator } from "../../src/transformers/ts-decorator"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("TsDecorator", () => {

    it("Should identify method decorator properly", () => {
        let ast = JsParser.getAst(`
        tslib_1.__decorate([
            decoOne("param"),
            tslib_1.__param(0, decoOne("param")),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyClass.prototype, "myMethod", null);
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyClass",
                analysis: Core.AnalysisType.Valid,
                methods: [{
                    type: "Method",
                    name: "myMethod",
                    analysis: Core.AnalysisType.Valid,
                    parameters: [<Core.ParameterMetaData>{
                        type: "Parameter",
                        name: "par1"
                    }]
                }]
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz.methods[0].decorators[0]).deep.eq(<Core.DecoratorMetaData>{
            type: "Decorator",
            name: "decoOne",
            analysis: Core.AnalysisType.Valid,
            location: {
                start: 42, end: 58
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 42, end: 58
                }
            }]
        });
    })

    it("Should identify property decorator properly", () => {
        let ast = JsParser.getAst(`
        tslib_1.__decorate([
            decoOne("param"),
            tslib_1.__param(0, decoOne("param")),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyClass.prototype, "myProperty", void 0);
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyClass",
                analysis: Core.AnalysisType.Valid,
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz.properties[0].name).eq("myProperty")
        Chai.expect(clazz.properties[0].decorators[0]).deep.eq(<Core.DecoratorMetaData>{
            type: "Decorator",
            name: "decoOne",
            analysis: Core.AnalysisType.Valid,
            location: {
                start: 42, end: 58
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 42, end: 58
                }
            }]
        });
    })

    it("Should identify class decorator properly", () => {
        let ast = JsParser.getAst(`
        MyClass = tslib_1.__decorate([
            decoOne("param"),
            tslib_1.__metadata("design:paramtypes", [])
        ], MyClass);
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyClass",
                analysis: Core.AnalysisType.Valid,
                methods: []
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz.decorators[0]).deep.eq(<Core.DecoratorMetaData>{
            type: "Decorator",
            name: "decoOne",
            analysis: Core.AnalysisType.Valid,
            location: {
                start: 52, end: 68
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 52, end: 68
                }
            }]
        });
    })



    it("Should not error if provided TS class", () => {
        let ast = JsParser.getAst(`
        var MyClass = (function () {
            function MyClass() {
            }
            MyClass.prototype.myMethod = function (par1) { };
            return MyClass;
        }());
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyClass",
                analysis: Core.AnalysisType.Valid,
                methods: []
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz.decorators).undefined;
    })

    it("Should not error when there is only decorators without classes", () => {
        let ast = JsParser.getAst(`
        MyClass = tslib_1.__decorate([
            decoOne("param"),
            tslib_1.__metadata("design:paramtypes", [])
        ], MyClass);
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Candidate
        }
        dummy.transform(ast, parent);
        Chai.expect(parent.children).undefined
    })

    it("Should not error when identify property decorator no class found", () => {
        let ast = JsParser.getAst(`
        tslib_1.__decorate([
            decoOne("param"),
            tslib_1.__param(0, decoOne("param")),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyClass.prototype, "myProperty", void 0);
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyOtherClass",
                analysis: Core.AnalysisType.Valid,
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz.properties).undefined
    })

    it("Should merge other property properly when identify property decorator", () => {
        let ast = JsParser.getAst(`
        tslib_1.__decorate([
            decoOne("param"),
            tslib_1.__param(0, decoOne("param")),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyClass.prototype, "myProperty", void 0);
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyClass",
                analysis: Core.AnalysisType.Valid,
                properties: [<Core.PropertyMetaData>{
                    type: "Property",
                    name: "theName",
                    analysis: Core.AnalysisType.Valid
                }]
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz.properties[1].name).eq("myProperty")
        Chai.expect(clazz.properties[1].decorators[0]).deep.eq(<Core.DecoratorMetaData>{
            type: "Decorator",
            name: "decoOne",
            analysis: Core.AnalysisType.Valid,
            location: {
                start: 42, end: 58
            },
            parameters: [<Core.MetaData>{
                type: "Parameter",
                name: "param",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 42, end: 58
                }
            }]
        });
    })

    it("Class decorator detection should not error when there is no match classes in the parent/module", () => {
        let ast = JsParser.getAst(`
        MyClass = tslib_1.__decorate([
            decoOne("param"),
            tslib_1.__metadata("design:paramtypes", [])
        ], MyClass);
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyOtherClass",
                analysis: Core.AnalysisType.Valid,
                methods: []
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz.decorators).undefined
    })

    it("Method decorator detection should not error when there is no match classes in the parent/module", () => {
        let ast = JsParser.getAst(`
        tslib_1.__decorate([
            decoOne("param"),
            tslib_1.__param(0, decoOne("param")),
            tslib_1.__metadata("design:type", Function),
            tslib_1.__metadata("design:paramtypes", [Object]),
            tslib_1.__metadata("design:returntype", void 0)
        ], MyClass.prototype, "myMethod", null);
        `)
        let dummy = new TsDecorator("ASTree");
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: [<Core.ClassMetaData>{
                type: "Class",
                name: "MyOtherClass",
                analysis: Core.AnalysisType.Valid,
                methods: [{
                    type: "Method",
                    name: "myMethod",
                    analysis: Core.AnalysisType.Valid,
                    parameters: [<Core.ParameterMetaData>{
                        type: "Parameter",
                        name: "par1"
                    }]
                }]
            }]
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz.methods[0].decorators).undefined
    })
})