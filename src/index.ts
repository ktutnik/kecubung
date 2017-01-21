import { MetaDataFactory, MetaData, MetadataType, AnalysisType } from "./core"
import { VisitorRegistry } from "./visitors"
import { Transformer } from "./transformer"

function transform(ast, fileName) {
    let transformer = new Transformer(VisitorRegistry.getVisitor(new MetaDataFactory()))
    return transformer.transform(ast, fileName);
}

export{transform, MetaData, MetadataType, AnalysisType}