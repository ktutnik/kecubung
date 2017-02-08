import * as ASTreeHelper from "../../src/analyzers/astree/helper"
import { JsParser } from "../helper"
import * as Chai from "chai"
import * as Util from "util"

describe("ASTree Helper", () => {
    it("Should transform string properly", () => {
        let ast = JsParser.getAst(`deco("This is string")`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({ type: 'String', value: 'This is string' })
    })

    it("Should transform boolean properly", () => {
        let ast = JsParser.getAst(`deco(false)`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({ type: 'Boolean', value: false })
    })

    it("Should transform number properly", () => {
        let ast = JsParser.getAst(`deco(200)`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({ type: 'Number', value: 200 })
    })

    it("Should transform null properly", () => {
        let ast = JsParser.getAst(`deco(null)`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({ type: 'Null', value: undefined })
    })

    it("Should transform object properly", () => {
        let ast = JsParser.getAst(`deco({name:"Nobita", age: 8})`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({
            type: 'Object',
            properties:
            [{
                type: 'String',
                name: 'name',
                value: { type: 'String', value: 'Nobita' }
            },
            {
                type: 'Number',
                name: 'age',
                value: { type: 'Number', value: 8 }
            }]
        })
    })

    it("Should transform deep object properly", () => {
        let ast = JsParser.getAst(`deco({character:{name: "Nobita"}, age: 8})`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({
            type: 'Object',
            properties:
            [{
                type: 'Object',
                name: 'character',
                value:
                {
                    type: 'Object',
                    properties:
                    [{
                        type: 'String',
                        name: 'name',
                        value: { type: 'String', value: 'Nobita' }
                    }]
                }
            },
            {
                type: 'Number',
                name: 'age',
                value: { type: 'Number', value: 8 }
            }]
        })
    })

    it("Should transform array properly", () => {
        let ast = JsParser.getAst(`deco([1, "Nobita"])`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({
            type: 'Array',
            children:
            [{ type: 'Number', value: 1 },
            { type: 'String', value: 'Nobita' }]
        })
    })


    it("Should transform complex parameter properly", () => {
        let ast = JsParser.getAst(`deco([1, {character:{names: ["Nobita", "Sizuka"]}, age: 8}])`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({
            type: 'Array',
            children:
            [{ type: 'Number', value: 1 },
            {
                type: 'Object',
                properties:
                [{
                    type: 'Object',
                    name: 'character',
                    value:
                    {
                        type: 'Object',
                        properties:
                        [{
                            type: 'Array',
                            name: 'names',
                            value:
                            {
                                type: 'Array',
                                children:
                                [{ type: 'String', value: 'Nobita' },
                                { type: 'String', value: 'Sizuka' }]
                            }
                        }]
                    }
                },
                {
                    type: 'Number',
                    name: 'age',
                    value: { type: 'Number', value: 8 }
                }]
            }]
        })
    })

    it("Should transform name if provide identifier", () => {
        let ast = JsParser.getAst(`deco(data)`)
        let result = ASTreeHelper.getDecoratorParameterName(ast.expression.arguments[0])
        Chai.expect(result).deep.eq({
            type: 'Unknown'
        })
    })
})