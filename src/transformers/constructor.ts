import { MethodAnalyzer } from "../analyzers/method-analyzer"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"


export class ConstructorTransformer extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node, parent: Core.ClassMetaData) {
        if (node.type == Core.SyntaxKind.FunctionDeclaration
            && node.id.name == parent.name) {
            let constructor = <Core.ConstructorMetaData>{
                type: "Constructor",
                name: node.id.name,
                analysis: Core.AnalysisType.Valid,
                location: node.loc.start,
                parameters: []
            }
            parent.constructor = constructor;
            this.traverse(node.params, constructor, [
                new ParameterTransformer()
            ])
        }
    }
}