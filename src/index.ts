import { Transformer } from "./transformer"
import { ParentMetaData } from "./core"
import { ParserType } from "./analyzers"
export {
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

export function transform(parser: ParserType, ast:any, fileName: string) {
    let transformer = new Transformer(fileName, parser)
    return transformer.transform(ast);
}

export {ParserType}

