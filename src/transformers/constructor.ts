import * as Analyzer from "../analyzers"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"


export class ConstructorTransformer extends Core.TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }

    @Core.Call.when(Core.SyntaxKind.FunctionDeclaration)
    transform(node, parent: Core.ClassMetaData) {
        let analyser = <Analyzer.ConstructorAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.Constructor, node)
        if (analyser.isConstructor(parent.name)) {
            let constructor = <Core.ConstructorMetaData>{
                type: "Constructor",
                name: analyser.getName(),
                analysis: Core.AnalysisType.Valid,
                location: analyser.getLocation(),
                parameters: []
            }
            parent.constructor = constructor;
            this.traverse(analyser.getParameters(), constructor, [
                new ParameterTransformer(this.parserType)
            ])
        }
    }
}