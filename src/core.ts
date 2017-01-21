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

export function flag(property, enumeration){
    return (property & enumeration) == enumeration;
}

export type MetadataType = "File" | "Module" | "Class" 
    | "Method" | "Parameter" | "Decorator" 
    | "Function" | "Constructor"

export interface MetaData {
    type: MetadataType,
    name: string,
    analysis: AnalysisType,
    children: MetaData[],
    decorators?: MetaData[],
    location?: {line: number, column: number}
}

export interface Visitor {
    start(node, meta: MetaData, metaParent: MetaData): MetaData
    exit(node, meta: MetaData, metaParent: MetaData): MetaData
}

export class MetaDataFactory{
    create(node, meta:MetaData, metaParent:MetaData): MetaData{
        meta.location = node.loc.start;
        return meta;
    }
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
}

export module Call {
    const META_DATA_KEY = "kamboja:Call.when";
    export function when(...kinds: string[]) {
        return function (target, method, descriptor) {
            Reflect.defineMetadata(META_DATA_KEY, kinds, target, method);
        }
    }

    export function getWhen(target, methodName: string) {
        return <string[]>Reflect.getMetadata(META_DATA_KEY, target, methodName);
    }
}
