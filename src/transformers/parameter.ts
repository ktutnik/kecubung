import * as Core from "../core"
import * as Analyzer from "../analyzers"

export class ParameterTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }
    
    @Core.Call.when(Core.SyntaxKind.Identifier)
    transform(node, parent: Core.MethodMetaData | Core.ConstructorMetaData) {
        let analyzer = <Analyzer.ParameterAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Parameter, node)
        parent.parameters.push(<Core.ParameterMetaData>{
            type: "Parameter",
            name: analyzer.getName(),
            analysis: Core.AnalysisType.Valid,
            location: analyzer.getLocation(),
        })
    }
}