import * as H from "../analyzers/helper"
import * as Core from "../core"


export class TsChildDecoratorTransformer extends Core.TransformerBase {
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

    private transformMethod(node, parent: Core.MethodMetaData | Core.ClassMetaData) {
        let method = <Core.DecoratorMetaData>{
            type: "Decorator",
            name: H.getMethodNameFromCallee(node.callee),
            analysis: Core.AnalysisType.Valid,
            location: {
                line: node.loc.start.line,
                column: node.loc.start.column
            },
            parameters: node.arguments.map(x => this.getParameter(x))
        }
        if (!parent.decorators) parent.decorators = []
        parent.decorators.push(method)
    }

    private transformParameter(node, parameter: Core.ParameterMetaData) {
        let decorator = <Core.DecoratorMetaData>{
            type: "Decorator",
            name: H.getMethodNameFromCallee(node.arguments[1].callee),
            analysis: Core.AnalysisType.Valid,
            location: {
                line: node.loc.start.line,
                column: node.loc.start.column
            },
            parameters: node.arguments[1].arguments
                .map(x => this.getParameter(x))
        };
        if (!parameter.decorators) parameter.decorators = []
        parameter.decorators.push(decorator)
    }

    private getParameter(x) {
        return <Core.MetaData>{
            type: "Parameter",
            name: H.getDecoratorParameterName(x),
            analysis: Core.AnalysisType.Valid,
            location: {
                line: x.loc.start.line,
                column: x.loc.start.column
            },
        };
    }
}