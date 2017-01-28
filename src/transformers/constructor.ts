import { ConstructorAnalyzer } from "../analyzers/constructor-analyser"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"


export class ConstructorTransformer extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.FunctionDeclaration)
    transform(node, parent: Core.ClassMetaData) {
        let analyser = new ConstructorAnalyzer(node)
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
                new ParameterTransformer()
            ])
        }
    }
}