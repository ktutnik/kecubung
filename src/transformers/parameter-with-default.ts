import * as Core from "../core"
import * as Analyzer from "../analyzers"

export class ParameterWithDefaultTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }
    
    @Core.Call.when(Core.SyntaxKind.AssignmentPattern)
    transform(node, parent: Core.MethodMetaData | Core.ConstructorMetaData) {
        let analyzer = <Analyzer.ParameterAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Parameter, node)
        if(!analyzer.withDefaultValue()) return
        parent.parameters.push(<Core.ParameterMetaData>{
            type: "Parameter",
            name: analyzer.getName(),
            analysis: Core.AnalysisType.Valid,
            location: analyzer.getLocation(),
        })
    }
}