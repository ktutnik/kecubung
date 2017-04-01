
import * as Analyzer from "../analyzers"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"


export class Es6ClassMember extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }
    
    @Core.Call.when(Core.SyntaxKind.ClassMethod)
    transform(node, parent: Core.ClassMetaData) {
        let analyser = <Analyzer.Es6MemberAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Es6ClassMember, node)
        let type = analyser.getType()
        if (analyser.isCandidate()) {
            let method = {
                type: type,
                name: analyser.getName(),
                analysis: Core.AnalysisType.Valid,
                location: analyser.getLocation(),
                parameters: [],
                decorators: undefined
            }
            if(!parent.methods) parent.methods = []
            if(type == "Method")
                parent.methods.push(method)
            if(type == "Constructor")
                parent.constructor = method
            this.traverse(analyser.getParameters(), method, [
                new ParameterTransformer(this.parserType)
            ])
        }
    }
}