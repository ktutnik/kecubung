
import { MethodAnalyzer } from "../analyzers/method-analyzer"
import { ParameterTransformer } from "./parameter"
import * as Core from "../core"


export class MethodTransformer extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.ExpressionStatement)
    transform(node, parent: Core.ClassMetaData) {
        let analyzer = new MethodAnalyzer(node);
        if (analyzer.isMethod(parent.name)) {
            let method = <Core.MethodMetaData>{
                type: "Method",
                name: analyzer.getName(),
                analysis: Core.AnalysisType.Valid,
                location: node.loc.start,
                parameters: []
            }
            if(!parent.methods) parent.methods = []
            parent.methods.push(method)
            this.traverse(node.expression.right.params, method, [
                new ParameterTransformer()
            ])
        }
    }
}