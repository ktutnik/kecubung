import {
    AnalysisType,
    ClassMetaData,
    ConstructorMetaData,
    DecoratorMetaData,
    flag,
    MetaData,
    MetadataType,
    MethodMetaData,
    ParameterMetaData,
    ParentMetaData,
    SyntaxKind,
    TransformerBase
} from "./core"
import { Transformer } from "./transformer"

function transform(ast, fileName: string) {
    let transformer = new Transformer(fileName)
    return transformer.transform(ast);
}

export { 
    transform, 
    AnalysisType,
    ClassMetaData,
    ConstructorMetaData,
    DecoratorMetaData,
    flag,
    MetaData,
    MetadataType,
    MethodMetaData,
    ParameterMetaData,
    ParentMetaData,
    SyntaxKind,
    TransformerBase
}