import { Transformer } from "./transformer"
import { ParentMetaData } from "./core"
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

export function transform(ast, fileName: string) {
    let transformer = new Transformer(fileName)
    return transformer.transform(ast);
}

