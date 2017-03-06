import "reflect-metadata"

export enum AnalysisType {
    Valid = 1,
    Candidate = 2,
    HasConstructor = 4,
    HasMethod = 8,
    Exported = 16,
    HasParameter = 32,
    ConnectedWithChildren = 64
}

export function flag(property, enumeration) {
    return (property & enumeration) == enumeration;
}

export type MetadataType = "File" | "Module" | "Class"
    | "Method" | "Parameter" | "Decorator"
    | "Function" | "Constructor" | "Property"

export type ValueMetaDataType = "Object" | "String" | "Boolean"
    | "Number" | "Array" | "Null" | "Unknown"

export interface SourceLocation {
    start: number,
    end: number
}

export interface ValueMetaData {
    type: ValueMetaDataType
    name?: string
    location?: SourceLocation
}

export interface PrimitiveValueMetaData extends ValueMetaData {
    type: "String" | "Boolean" | "Number" | "Null"
    value: any
}

export interface ObjectValueMetaData extends ValueMetaData {
    type: "Object",
    properties: ValueMetaData[]
}

export interface ArrayValueMetaData extends ValueMetaData {
    type: "Array",
    children: ValueMetaData[]
}

export interface MetaData {
    type: MetadataType
    name: string
    analysis: AnalysisType
    location?: SourceLocation
}

export interface DecoratorMetaData extends MetaData {
    type: "Decorator"
    parameters: ValueMetaData[]
}


export interface ParameterMetaData extends MetaData {
    type: "Parameter"
    decorators: DecoratorMetaData[]
}

export interface MethodMetaData extends MetaData {
    type: "Method"
    decorators: DecoratorMetaData[]
    parameters: ParameterMetaData[]
}

export interface PropertyMetaData extends MetaData {
    type: "Property"
    decorators: DecoratorMetaData[]
}

export interface ConstructorMetaData extends MetaData {
    type: "Constructor"
    parameters: ParameterMetaData[]
}

export interface ClassMetaData extends MetaData {
    type: "Class"
    decorators: DecoratorMetaData[]
    methods: MethodMetaData[]
    properties: PropertyMetaData[]
    baseClass: string
    constructor: ConstructorMetaData
}

export interface ParentMetaData extends MetaData {
    type: "Module" | "File"
    children: MetaData[]
}

export module SyntaxKind {
    export const File = "File"
    export const Program = "Program"
    export const BlockStatement = "BlockStatement"
    export const VariableDeclaration = "VariableDeclaration"
    export const VariableDeclarator = "VariableDeclarator"
    export const FunctionExpression = "FunctionExpression"
    export const FunctionDeclaration = "FunctionDeclaration"
    export const ClassDeclaration = "ClassDeclaration"
    export const ClassBody = "ClassBody"
    export const ExpressionStatement = "ExpressionStatement"
    export const AssignmentExpression = "AssignmentExpression"
    export const CallExpression = "CallExpression"
    export const MemberExpression = "MemberExpression"
    export const ArrayExpression = "ArrayExpression"
    export const LogicalExpression = "LogicalExpression"
    export const Identifier = "Identifier"
    export const StringLiteral = "StringLiteral"
    export const NumericLiteral = "NumericLiteral"
    export const BooleanLiteral = "BooleanLiteral"
    export const ClassMethod = "ClassMethod"
    export const ClassExpression = "ClassExpression"
    export const UnaryExpression = "UnaryExpression"
    export const NullLiteral = "NullLiteral"
    export const ObjectExpression = "ObjectExpression"
    export const ObjectProperty = "ObjectProperty"
}

export module Call {
    const META_DATA_KEY = "kamboja:Call.when";
    export function when(kind: string) {
        return function (target, method, descriptor) {
            Reflect.defineMetadata(META_DATA_KEY, kind, target, method);
        }
    }

    export function getWhen(target, methodName: string) {
        let result = <string>Reflect.getMetadata(META_DATA_KEY, target, methodName);
        if (typeof result == "undefined") throw new Error("Unable to get metadata identifier, try to re-install refrect-metadata module")
        return result;
    }
}

export abstract class TransformerBase {
    abstract transform(node, parent: MetaData)

    protected traverse(children: any[], metaData: MetaData, transformers: TransformerBase[]) {
        let calls = this.getCalls(transformers)
        for (let child of children) {
            if (calls.some(x => x == child.type)) {
                for (let transformer of transformers) {
                    transformer.transform(child, metaData)
                }
            }
        }
    }

    private getCalls(traversers: TransformerBase[]) {
        let calls: string[] = []
        for (let traverser of traversers) {
            let cal = Call.getWhen(traverser, "transform");
            calls.push(cal)
        }
        return calls;
    }
}
