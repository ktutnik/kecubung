import * as H from "../analyzers/helper"
import * as Core from "../core"


export class TsChildDecorator extends Core.TransformerBase {
    @Core.Call.when(Core.SyntaxKind.CallExpression)
    transform(node, parent: Core.MethodMetaData | Core.ClassMetaData) {
        if (!H.isReservedDecorator(node)) {
            this.transformMethod(node, parent)
        }
        else if (H.getMethodNameFromCallee(node.callee) == "__param"
            && parent.type == "Method" 
            && parent.parameters.length > 0) {
            let parameter = parent.parameters[parseInt(node.arguments[0].value)]
            this.transformParameter(node, parameter)
        }
    }

    private transformMethod(node, parent: Core.MethodMetaData|Core.ClassMetaData) {
        if (!parent.decorators) parent.decorators = []
        let method = <Core.DecoratorMetaData>{
            type: "Decorator",
            name: node.callee.name,
            analysis: Core.AnalysisType.Valid,
            location: node.loc.start,
            parameters: node.arguments.map(x => this.getParameter(x))
        }
        parent.decorators.push(method)
    }

    private transformParameter(node, parameter: Core.ParameterMetaData) {
        if (!parameter.decorators) parameter.decorators = []
        let decorator = <Core.DecoratorMetaData>{
            type: "Decorator",
            name: H.getMethodNameFromCallee(node.arguments[1].callee),
            analysis: Core.AnalysisType.Valid,
            location: node.loc.start,
            parameters: node.arguments[1].arguments
                .map(x => this.getParameter(x))
        };
        parameter.decorators.push(decorator)
    }

    private getParameter(x) {
        return <Core.MetaData>{
            type: "Parameter",
            name: H.getDecoratorParameterName(x),
            analysis: Core.AnalysisType.Valid,
            location: x.loc.start
        };
    }
}