
import * as Core from "../../src/core"
import { TsClassTransformer } from "../../src/transformers/ts-class"
import { JsParser } from "../helper"
import * as Chai from "chai"


describe("TsClassTransformer", () => {

    it("Should identify class properly", () => {
        let ast = JsParser.getAst(`
        var MyClass = (function () {
            function MyClass() {
            }
            MyClass.prototype.myMethod = function (par1) { };
            return MyClass;
        }());
        `)
        let dummy = new TsClassTransformer();
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz).deep.eq(<Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            baseClass: null,
            location: {
                column: 8, line: 2
            },
            analysis: Core.AnalysisType.Candidate
            | Core.AnalysisType.HasConstructor
            | Core.AnalysisType.HasMethod,
            constructor: {
                type: "Constructor",
                analysis: Core.AnalysisType.Valid,
                location: {
                    column: 12, line: 3
                },
                name: "MyClass",
                parameters: []
            },
            methods: [{
                type: "Method",
                name: "myMethod",
                analysis: Core.AnalysisType.Valid,
                location: {
                    column: 12, line: 5
                },
                parameters: [<Core.ParameterMetaData>{
                    type: "Parameter",
                    name: "par1",
                    analysis: Core.AnalysisType.Valid,
                    location: {
                        column: 51, line: 5
                    },
                }]
            }]
        });
    })

    it("Should identify class with inheritance", () => {
        let ast = JsParser.getAst(`
        var MyClass = (function (_super) {
            tslib_1.__extends(MyClass, _super);
            function MyClass() {
                return _super.call(this) || this;
            }
            MyClass.prototype.myMethod = function (par1) { };
            return MyClass;
        }(MyModule.MyBaseClass));
        `)
        let dummy = new TsClassTransformer();
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        dummy.transform(ast, parent);
        let clazz = <Core.ClassMetaData>parent.children[0];
        Chai.expect(clazz).deep.eq(<Core.ClassMetaData>{
            type: "Class",
            name: "MyClass",
            baseClass: "MyBaseClass",
            location: {
                column: 8, line: 2
            },
            analysis: Core.AnalysisType.Candidate
            | Core.AnalysisType.HasConstructor
            | Core.AnalysisType.HasMethod,
            constructor: {
                type: "Constructor",
                analysis: Core.AnalysisType.Valid,
                location: {
                    column: 12, line: 4
                },
                name: "MyClass",
                parameters: []
            },
            methods: [{
                type: "Method",
                name: "myMethod",
                analysis: Core.AnalysisType.Valid,
                location: {
                    column: 12, line: 7
                },
                parameters: [<Core.ParameterMetaData>{
                    type: "Parameter",
                    name: "par1",
                    analysis: Core.AnalysisType.Valid,
                    location: {
                        column: 51, line: 7
                    },
                }]
            }]
        });
    })

    it("Should not error when provided 'exports'", () => {
        let ast = JsParser.getAst(`
        exports.MyClass = MyClass
        `)
        let dummy = new TsClassTransformer();
        let parent = <Core.ParentMetaData>{
            type: "Module",
            name: "MyModule",
            analysis: Core.AnalysisType.Valid,
            children: []
        }
        dummy.transform(ast, parent);
        Chai.expect(parent.children.length).eq(0);
    })
})