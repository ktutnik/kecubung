import {ParserType, AnalyzerType} from "./baseclasses"
import * as AsTree from "./astree"

export function get(parser:ParserType, type:AnalyzerType, node):any{
    switch(parser){
        case "ASTree":
            return AsTree.get(type, node)
        case "Acorn":
            return
    }
}

export {
    ParserType, 
    AnalyzerType, 
    ChildDecoratorAnalyzer, 
    ClassAnalyzer, 
    ConstructorAnalyzer, 
    DecoratorAnalyzer, 
    FileAnalyzer, 
    MethodAnalyzer, 
    ModuleAnalyzer, 
    ParameterAnalyzer
} from "./baseclasses"