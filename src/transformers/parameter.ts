import * as Core from "../core"

export class ParameterTransformer extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.Identifier)
    transform(node, parent: Core.MethodMetaData | Core.ConstructorMetaData) {
        if(!parent.parameters) parent.parameters = []
        parent.parameters.push(<Core.ParameterMetaData>{
            type: "Parameter",
            name: node.name,
            analysis: Core.AnalysisType.Valid,
            location: node.loc.start
        })
    }
}