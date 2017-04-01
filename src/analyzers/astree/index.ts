import { AnalyzerType } from "../baseclasses"

import { ChildDecoratorAnalyzer } from "./child-decorator-analyzer"
import { ClassAnalyzer } from "./class-analyzer"
import { ConstructorAnalyzer } from "./constructor-analyser"
import { DecoratorAnalyzer } from "./decorator-analyzer"
import { FileAnalyzer } from "./file-analyzer"
import { MethodAnalyzer } from "./method-analyzer"
import { ModuleAnalyzer } from "./module-analyzer"
import { ParameterAnalyzer } from "./parameter-analyzer"
import { Es6ClassAnalyzer } from "./es6-class-analyzer"
import { Es6MemberAnalyzer } from "./es6-member-analyzer"

export function get(type: AnalyzerType, node) {
    switch (type) {
        case AnalyzerType.ChildDecorator:
            return new ChildDecoratorAnalyzer(node)
        case AnalyzerType.File:
            return new FileAnalyzer(node);
        case AnalyzerType.Decorator:
            return new DecoratorAnalyzer(node);
        case AnalyzerType.Method:
            return new MethodAnalyzer(node);
        case AnalyzerType.Parameter:
            return new ParameterAnalyzer(node);
        case AnalyzerType.Constructor:
            return new ConstructorAnalyzer(node);
        case AnalyzerType.TSClass:
            return new ClassAnalyzer(node);
        case AnalyzerType.Es6Class:
            return new Es6ClassAnalyzer(node)
        case AnalyzerType.TSModule:
            return new ModuleAnalyzer(node);
        case AnalyzerType.Es6ClassMember:
            return new Es6MemberAnalyzer(node)
    }
}


export { ChildDecoratorAnalyzer } 
export { ClassAnalyzer } 
export { ConstructorAnalyzer } 
export { DecoratorAnalyzer } 
export { FileAnalyzer } 
export { MethodAnalyzer } 
export { ModuleAnalyzer } 
export { ParameterAnalyzer } 
export { Es6ClassAnalyzer } 
export { Es6MemberAnalyzer }
