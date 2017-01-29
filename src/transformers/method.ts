
import * as Analyzer from "../analyzers"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"


export class MethodTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }
    
    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node, parent: Core.ClassMetaData) {
        let analyser = <Analyzer.MethodAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Method, node)
        if (analyser.isMethod(parent.name)) {
            let method = <Core.MethodMetaData>{
                type: "Method",
                name: analyser.getName(),
                analysis: Core.AnalysisType.Valid,
                location: analyser.getLocation(),
                parameters: []
            }
            if(!parent.methods) parent.methods = []
            parent.methods.push(method)
            this.traverse(analyser.getParameters(), method, [
                new ParameterTransformer(this.parserType)
            ])
        }
    }
}