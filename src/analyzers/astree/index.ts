import {AnalyzerType} from "../baseclasses"

import { ChildDecoratorAnalyzer } from "./child-decorator-analyzer"
import { ClassAnalyzer } from "./class-analyzer"
import { ConstructorAnalyzer } from "./constructor-analyser"
import { DecoratorAnalyzer } from "./decorator-analyzer"
import { FileAnalyzer } from "./file-analyzer"
import { MethodAnalyzer } from "./method-analyzer"
import { ModuleAnalyzer } from "./module-analyzer"
import { ParameterAnalyzer } from "./parameter-analyzer"

export function get(type:AnalyzerType, node){
    switch(type){
        case AnalyzerType.ChildDecorator:
            return new ChildDecoratorAnalyzer(node)
        case AnalyzerType.File: 
            return  new FileAnalyzer(node);
        case AnalyzerType.Decorator: 
            return  new DecoratorAnalyzer(node);
        case AnalyzerType.Method: 
            return  new MethodAnalyzer(node);
        case AnalyzerType.Parameter: 
            return  new ParameterAnalyzer(node);
        case AnalyzerType.Constructor: 
            return  new ConstructorAnalyzer(node);
        case AnalyzerType.TSClass: 
            return  new ClassAnalyzer(node);
        case AnalyzerType.TSModule: 
            return  new ModuleAnalyzer(node);
    }
}


export { ChildDecoratorAnalyzer } from "./child-decorator-analyzer"
export { ClassAnalyzer } from "./class-analyzer"
export { ConstructorAnalyzer } from "./constructor-analyser"
export { DecoratorAnalyzer } from "./decorator-analyzer"
export { FileAnalyzer } from "./file-analyzer"
export { MethodAnalyzer } from "./method-analyzer"
export { ModuleAnalyzer } from "./module-analyzer"
export { ParameterAnalyzer } from "./parameter-analyzer"
