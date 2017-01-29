
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
        let dummy = new TsClassTransformer("ASTree");
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
                start: 9, end: 188
            },
            analysis: Core.AnalysisType.Candidate
            | Core.AnalysisType.HasConstructor
            | Core.AnalysisType.HasMethod,
            constructor: {
                type: "Constructor",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 50, end: 84
                },
                name: "MyClass",
                parameters: []
            },
            methods: [{
                type: "Method",
                name: "myMethod",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 97, end: 146
                },
                parameters: [<Core.ParameterMetaData>{
                    type: "Parameter",
                    name: "par1",
                    analysis: Core.AnalysisType.Valid,
                    location: {
                        start: 136, end: 140
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
        let dummy = new TsClassTransformer("ASTree");
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
                start: 9, end: 312
            },
            analysis: Core.AnalysisType.Candidate
            | Core.AnalysisType.HasConstructor
            | Core.AnalysisType.HasMethod,
            constructor: {
                type: "Constructor",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 104, end: 188
                },
                name: "MyClass",
                parameters: []
            },
            methods: [{
                type: "Method",
                name: "myMethod",
                analysis: Core.AnalysisType.Valid,
                location: {
                    start: 201, end: 250
                },
                parameters: [<Core.ParameterMetaData>{
                    type: "Parameter",
                    name: "par1",
                    analysis: Core.AnalysisType.Valid,
                    location: {
                        start: 240, end: 244
                    },
                }]
            }]
        });
    })

    it("Should not error when provided 'exports'", () => {
        let ast = JsParser.getAst(`
        exports.MyClass = MyClass
        `)
        let dummy = new TsClassTransformer("ASTree");
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