import * as Core from "../core"
import {ParameterAnalyzer} from "../analyzers/parameter-analyzer"

export class ParameterTransformer extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.Identifier)
    transform(node, parent: Core.MethodMetaData | Core.ConstructorMetaData) {
        if (!parent.parameters) parent.parameters = []
        let analyzer = new ParameterAnalyzer(node)
        parent.parameters.push(<Core.ParameterMetaData>{
            type: "Parameter",
            name: analyzer.getName(),
            analysis: Core.AnalysisType.Valid,
            location: analyzer.getLocation(),
        })
    }
}