import { AnalysisType, MetaData, MetaDataFactory, flag } from "../../src/core"
import { ClassVisitor } from "../../src/visitors/class-visitor"
import { JsParser, MH } from "../helper"
import * as Chai from "chai"

describe("Class Visitor", () => {
    let clazz: MetaData;
    let dummy:ClassVisitor;

    beforeEach(() => {
        dummy = new ClassVisitor(new MetaDataFactory())
        clazz = {
            type: "Class",
            name: "MyClass",
            analysis: AnalysisType.Candidate,
            children: []
        }
    })

    it("Should identify variable assignment to auto execute function as candidate", () => {
        let ast = JsParser.getAst(`
            var MyClass = (function(){

            }())
        `)
        let result = dummy.start(ast, null, null);
        Chai.expect(flag(result.analysis, AnalysisType.Candidate)).eq(true);
    })

    it("Should identify class with inheritance", () => {
        let ast = JsParser.getAst(`
            var MyClass = (function(_super){

            }(Parameter))
        `)
        let result = dummy.start(ast, null, null);
        Chai.expect(flag(result.analysis, AnalysisType.Candidate)).eq(true);
    })

    it("Should identify function declaration as constructor", () => {
        let ast = JsParser.getAst(`
            function MyClass(){}
        `)
        let result = dummy.start(ast, clazz, null);
        Chai.expect(flag(clazz.analysis, AnalysisType.HasConstructor)).eq(true);
        Chai.expect(result.type).eq("Constructor")
    })

    it("Should identify constructor with parameters", () => {
        let ast = JsParser.getAst(`
            function MyClass(par1, par2){}
        `)
        let result = dummy.start(ast, clazz, null);
        clazz.children.push(result);
        Chai.expect(flag(clazz.analysis, AnalysisType.HasConstructor)).eq(true);
        Chai.expect(MH.validateConstructor(clazz, ["par1", "par2"])).true;
    })

    it("Should return null if meta type is not Class", () => {
        let ast = JsParser.getAst(`
            function MyClass(){}
        `)
        let result = dummy.start(ast, {
            type: "Module",
            name: "MyModule",
            analysis: AnalysisType.Candidate,
            children: []
        }, null);
        Chai.expect(result).null
    })

    

    it("Should identify prototype assignment as method", () => {
        let ast = JsParser.getAst(`
            MyClass.prototype.myFunction = function(par1, par2){}
        `)
        clazz.analysis |= AnalysisType.HasConstructor;
        let result = dummy.start(ast.expression, clazz, null);
        Chai.expect(flag(clazz.analysis, AnalysisType.HasMethod)).eq(true);
        Chai.expect(MH.validateMethod(result, "myFunction", ["par1", "par2"])).true
    })

    it("Should return null if supplied prototype assignment but meta type is not Class", () => {
        let ast = JsParser.getAst(`
            MyClass.prototype.myFunction = function(par1, par2){}
        `)
        let result = dummy.start(ast.expression, {
            type: "Module", //<-- meta type module
            name: "MyModule",
            analysis: AnalysisType.Candidate,
            children: []
        }, null);
        Chai.expect(result).null;
    })

    it("Should verify as valid if has all flag (HasMethod, HasConstructor, Exported)", () => {
        let ast = JsParser.getAst(`
            ParentModule.MyClass = MyClass
        `)
        clazz.analysis |= AnalysisType.HasConstructor;
        clazz.analysis |= AnalysisType.HasMethod;
        let module: MetaData = {
            type: "Module",
            name: "ParentModule",
            analysis: AnalysisType.Candidate,
            children: [clazz]
        }
        dummy.exit(ast.expression, module, null);
        Chai.expect(flag(clazz.analysis, AnalysisType.Exported)).eq(true);
        Chai.expect(flag(clazz.analysis, AnalysisType.Valid)).eq(true);
    })

    it("Should return null if meta is not module", () => {
        let ast = JsParser.getAst(`
            ParentModule.MyClass = MyClass
        `)
        clazz.analysis |= AnalysisType.HasConstructor;
        clazz.analysis |= AnalysisType.HasMethod;
        let module: MetaData = {
            type: "Class",
            name: "ParentModule",
            analysis: AnalysisType.Candidate,
            children: [clazz]
        }
        let result = dummy.exit(ast.expression, module, null);
        Chai.expect(result).null;
    })

    it("Should verify as valid if has flags (HasMethod, HasConstructor)", () => {
        let ast = JsParser.getAst(`
            ParentModule.MyClass = MyClass
        `)
        clazz.analysis |= AnalysisType.HasConstructor;
        clazz.analysis |= AnalysisType.HasMethod;
        let module: MetaData = {
            type: "Module",
            name: "ParentModule",
            analysis: AnalysisType.Candidate,
            children: [clazz]
        }
        dummy.exit(ast.expression, module, null);
        Chai.expect(flag(clazz.analysis, AnalysisType.Exported)).eq(true);
        Chai.expect(flag(clazz.analysis, AnalysisType.Valid)).eq(true);
    })

    it("Should not verify exported if different class name", () => {
        let ast = JsParser.getAst(`
            ParentModule.OtherClass = OtherClass
        `)
        clazz.analysis |= AnalysisType.HasConstructor;
        clazz.analysis |= AnalysisType.HasMethod;
        let module: MetaData = {
            type: "Module",
            name: "ParentModule",
            analysis: AnalysisType.Candidate,
            children: [clazz]
        }
        dummy.exit(ast.expression, module, null);
        Chai.expect(flag(clazz.analysis, AnalysisType.Exported)).eq(false);
    })

    it("Should not verify as valid if doesn't have any of (HasMethod, HasConstructor)", () => {
        let ast = JsParser.getAst(`
            ParentModule.MyClass = MyClass
        `)
        clazz.analysis |= AnalysisType.HasConstructor; //<-- doesn't have method
        let module: MetaData = {
            type: "Module",
            name: "ParentModule",
            analysis: AnalysisType.Candidate,
            children: [clazz]
        }
        dummy.exit(ast.expression, module, null);
        Chai.expect(flag(clazz.analysis, AnalysisType.Exported)).eq(true);
        Chai.expect(flag(clazz.analysis, AnalysisType.Valid)).eq(false); //<-- should not valid
    })

    it("Should identify es6 class properly", () => {
        let ast = JsParser.getAst(`
            var MyClass = class MyClass {
                constructor() { }
                myMethod(par1) { }
            }
        `)
        clazz.analysis |= AnalysisType.HasConstructor;
        clazz.analysis |= AnalysisType.HasMethod;
        let module: MetaData = {
            type: "Module",
            name: "ParentModule",
            analysis: AnalysisType.Candidate,
            children: [clazz]
        }
        let result = dummy.start(ast.declarations[0].init, module, null);
        Chai.expect(MH.validateClass(result, {name: "MyClass", flags: [AnalysisType.Candidate]})).true
    })

    it("Should identify es6 constructor properly", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor(par1, par2) { }
                myMethod(par1) { }
            }
        `)
        
        let result = dummy.start(ast.body.body[0], clazz, null);
        clazz.children.push(result);
        Chai.expect(flag(clazz.analysis, AnalysisType.HasConstructor)).true
        Chai.expect(MH.validateConstructor(clazz, ["par1", "par2"])).true
    })

    it("Should identify es6 method properly", () => {
        let ast = JsParser.getAst(`
            class MyClass {
                constructor(par1, par2) { }
                myMethod(par1) { }
            }
        `)
        clazz.analysis |= AnalysisType.HasConstructor;
        let result = dummy.start(ast.body.body[1], clazz, null);
        Chai.expect(flag(clazz.analysis, AnalysisType.HasMethod)).true
        Chai.expect(MH.validateMethod(result, "myMethod", ["par1"])).true
    })
})