import * as Core from "../src/core"
import { Transformer } from "../src/transformer"
import { JsParser } from "./helper"
import * as Chai from "chai"
import * as Fs from "fs"
import * as Path from "path"
import * as Babylon from "babylon"


describe("Transformer", () => {

    it("Should transform TypeScript generated file properly", () => {
        let filename = "./dummy/dummy.js"
        let code = Fs.readFileSync(Path.join(__dirname, filename)).toString()
        let dummy = new Transformer(filename);
        let ast = Babylon.parse(code);
        let result = dummy.transform(ast);
        Chai.expect(result).deep.eq({
            "type": "File",
            "name": "./dummy/dummy.js",
            "analysis": 1,
            "children": [
                {
                    "type": "Module",
                    "analysis": 83,
                    "children": [
                        {
                            "type": "Class",
                            "name": "MyBaseClass",
                            "baseClass": null,
                            "location": {
                                "line": 21,
                                "column": 4
                            },
                            "analysis": 31,
                            "constructor": {
                                "type": "Constructor",
                                "name": "MyBaseClass",
                                "analysis": 1,
                                "location": {
                                    "line": 22,
                                    "column": 8
                                },
                                "parameters": []
                            },
                            "methods": [
                                {
                                    "type": "Method",
                                    "name": "baseMethod",
                                    "analysis": 1,
                                    "location": {
                                        "line": 24,
                                        "column": 8
                                    },
                                    "parameters": [
                                        {
                                            "type": "Parameter",
                                            "name": "par1",
                                            "analysis": 1,
                                            "location": {
                                                "line": 24,
                                                "column": 53
                                            }
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "type": "Class",
                            "name": "MyClass",
                            "baseClass": "MyBaseClass",
                            "location": {
                                "line": 28,
                                "column": 4
                            },
                            "analysis": 31,
                            "constructor": {
                                "type": "Constructor",
                                "name": "MyClass",
                                "analysis": 1,
                                "location": {
                                    "line": 30,
                                    "column": 8
                                },
                                "parameters": []
                            },
                            "methods": [
                                {
                                    "type": "Method",
                                    "name": "myMethod",
                                    "analysis": 1,
                                    "location": {
                                        "line": 33,
                                        "column": 8
                                    },
                                    "parameters": [
                                        {
                                            "type": "Parameter",
                                            "name": "par1",
                                            "analysis": 1,
                                            "location": {
                                                "line": 33,
                                                "column": 47
                                            },
                                            "decorators": [
                                                {
                                                    "type": "Decorator",
                                                    "name": "decoOne",
                                                    "analysis": 1,
                                                    "location": {
                                                        "line": 38,
                                                        "column": 8
                                                    },
                                                    "parameters": []
                                                }
                                            ]
                                        }
                                    ],
                                    "decorators": [
                                        {
                                            "type": "Decorator",
                                            "name": "decoOne",
                                            "analysis": 1,
                                            "location": {
                                                "line": 37,
                                                "column": 8
                                            },
                                            "parameters": []
                                        }
                                    ]
                                }
                            ],
                            "decorators": [
                                {
                                    "type": "Decorator",
                                    "name": "decoTwo",
                                    "analysis": 1,
                                    "location": {
                                        "line": 44,
                                        "column": 8
                                    },
                                    "parameters": [
                                        {
                                            "type": "Parameter",
                                            "name": "halo",
                                            "analysis": 1,
                                            "location": {
                                                "line": 44,
                                                "column": 16
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ],
                    "location": {
                        "line": 20,
                        "column": 0
                    },
                    "name": "MyModule"
                }
            ],
            "location": {
                "line": 1,
                "column": 0
            }
        }
        )
    })
})