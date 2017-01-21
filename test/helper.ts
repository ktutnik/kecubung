import * as babylon from "babylon";
import { MetaData, flag } from "../src/core"

export module JsParser {
    export function getAst(code: string, complete = false) {
        let ast = <any>babylon.parse(code);

        return complete ? ast : ast.program.body[0];
    }
}

export module MH {
    export function validate(meta: MetaData, properties, flags: number[]) {
        let result = true;
        if (properties) {
            for (let prop in properties) {
                if (meta[prop] != properties[prop])
                    result = false;
            }
        }
        if (flags && flags.length > 0) {
            for (let fl of flags) {
                if (!flag(meta.analysis, fl))
                    result = false;
            }
        }
        return result;
    }

    export function validateParameters(meta: MetaData[], param: string[]) {
        let validParams = true;
        for (let i = 0; i < meta.length; i++) {
            let result = validate(meta[i], { type: "Parameter", name: param[i] }, null)
            if (!result) {
                console.error(`Validation Error: Parameter ${param[i]} is invalid`)
                validParams = false;
            }
        }
        return validParams;
    }

    export function validateMethod(meta: MetaData, name: string, param: string[]) {
        let validMethod = validate(meta, { type: "Method", name: name }, null);
        let validParams = validateParameters(meta.children, param)
        if(!validMethod){
            console.error(`Validation Error: Method ${name} is not valid`)
        }
        return validMethod && validParams;
    }

    export function validateConstructor(meta: MetaData, param: string[]) {
        let validMethod = validate(meta.children[0], { type: "Constructor", name: meta.name }, null);
        let validParams = validateParameters(meta.children[0].children, param)
        if(!validMethod){
            console.error(`Validation Error: Constructor ${meta.name} is not valid`)
        }
        return validMethod && validParams;
    }
    export interface ClassValidationOption{
        name:string,
        constructorParams?: string[],
        methods?: Array<{name:string, params:string[]}>
        flags?: number[]
    }
    export function validateClass(meta: MetaData, opt:ClassValidationOption) {
        let validMethods = true;
        let validFlag = true;
        let validConstructor = true;
        let validClass = validate(meta, { type: "Class", name: opt.name }, null);
        if(opt.constructorParams){
            let result = validateConstructor(meta, opt.constructorParams)
            if(!result) validConstructor = false
        }
        if (opt.methods) {
            for (let i = 0; i < opt.methods.length; i++) {
                let mtd = opt.methods[i]
                let validMethod = validateMethod(meta.children[i + 1], mtd.name, mtd.params)
                if (!validMethod) validMethods = false;
            }
        }
        if(opt.flags){
            let result = validate(meta, null, opt.flags)
            if(!result) validFlag = false
        }
        return validClass && validMethods && validConstructor && validFlag;
    }
}