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
 * require CallExpression 
 */
export function isReservedDecorator(callExpression) {
    return getMethodNameFromCallee(callExpression.callee) == "__metadata"
        || getMethodNameFromCallee(callExpression.callee) == "__param"
        || getMethodNameFromCallee(callExpression.callee) == "__decorate"
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