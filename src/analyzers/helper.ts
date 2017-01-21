import { SyntaxKind, MetaData, AnalysisType } from "../core"

/**
 * require CallExpression.callee
 */
export function getMethodNameFromCallee(callee) {
    if (!callee) return "";
    if (callee.type == SyntaxKind.MemberExpression) return callee.property.name;
    else return callee.name;
}

/**
 * require ArrayExpression
 */
export function getDecorators(arrayExpression) {
    let result = [];
    for (let x of arrayExpression.elements) {
        if (isReservedDecorator(x)) continue;
        result.push(<MetaData>{
            type: "Decorator",
            name: getMethodNameFromCallee(x.callee),
            analysis: AnalysisType.Valid,
            children: x.arguments.map(arg => <MetaData>{
                type: "Parameter",
                name: getDecoratorParameterName(arg),
                analysis: AnalysisType.Valid,
                children: []
            })
        })
    }
    return result;
}

/**
 * require CallExpression 
 */
export function isReservedDecorator(callExpression) {
    return getMethodNameFromCallee(callExpression.callee) == "__metadata"
        || getMethodNameFromCallee(callExpression.callee) == "__param"
}

export function getDecoratorParameterName(param) {
    switch (param.type) {
        case SyntaxKind.StringLiteral:
        case SyntaxKind.NumericLiteral:
        case SyntaxKind.BooleanLiteral:
            return param.value;
        case SyntaxKind.Identifier:
            return param.name;
        default:
            return "Unknown";
    }
}