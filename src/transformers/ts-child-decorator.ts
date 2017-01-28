import { ChildDecoratorAnalyzer } from "../analyzers/child-decorator-analyzer"
import * as Core from "../core"


export class TsChildDecoratorTransformer extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.CallExpression)
    transform(node, parent: Core.MethodMetaData | Core.ClassMetaData) {
        let analyzers = new ChildDecoratorAnalyzer(node)
        if (analyzers.isMethodDecorator()) {
            this.transformMethod(analyzers, parent)
        }
        else if (analyzers.isParameterDecorator()
            && parent.type == "Method"
            && parent.parameters.length > 0) {
            let parameter = parent.parameters[parseInt(node.arguments[0].value)]
            this.transformParameter(analyzers, parameter)
        }
    }

    private transformMethod(analyzer: ChildDecoratorAnalyzer, parent: Core.MethodMetaData | Core.ClassMetaData) {
        let method = <Core.DecoratorMetaData>{
            type: "Decorator",
            name: analyzer.getMethodName(),
            analysis: Core.AnalysisType.Valid,
            location: analyzer.getMethodLocation(),
            parameters: analyzer.getMethodParameters()
        }
        if (!parent.decorators) parent.decorators = []
        parent.decorators.push(method)
    }

    private transformParameter(analyzer: ChildDecoratorAnalyzer, parameter: Core.ParameterMetaData) {
        let decorator = <Core.DecoratorMetaData>{
            type: "Decorator",
            name: analyzer.getParameterDecoratorName(),
            analysis: Core.AnalysisType.Valid,
            location: analyzer.getParameterDecoratorLocation(),
            parameters: analyzer.getParameterDecoratorParameters()
        };
        if (!parameter.decorators) parameter.decorators = []
        parameter.decorators.push(decorator)
    }

}