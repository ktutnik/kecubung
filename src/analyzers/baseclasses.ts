import { SyntaxKind, MethodMetaData, MetaData, ValueMetaData, AnalysisType, SourceLocation } from "../core"

export type ParserType = "ASTree" | "Acorn"
export enum AnalyzerType {
    File, 
    Decorator, 
    ChildDecorator, 
    Es6Class,
    TSClass, 
    TSModule, 
    Constructor, 
    Method, 
    Parameter, 
    ValueAnalyzer,
    Es6ClassMember
}

export interface ChildDecoratorAnalyzer {
    isMethodDecorator(): boolean
    isParameterDecorator(): boolean
    getMethodName(): string
    getMethodLocation(): SourceLocation
    getMethodParameters(): ValueMetaData[]
    getParameterDecoratorName(): string
    getParameterDecoratorLocation(): SourceLocation
    getParameterDecoratorParameters(): ValueMetaData[]
}

export interface ClassAnalyzer {
    isExported(name, parentName): boolean
    getLocation(): SourceLocation
    getMember(): any[]
    getName(): string
    getParentName(): string
    isCandidate(): boolean
    getBaseClass(): string
}

export interface ConstructorAnalyzer {
    isConstructor(className: string): boolean
    getName(): string
    getLocation(): SourceLocation
    getParameters(): any[]
}

export interface DecoratorAnalyzer {
    isMethodDecorator(): boolean
    isPropertyDecorator(): boolean
    getClassName(): string
    getMethodName(): string
    isClassDecorator(): boolean
    getChildren():any[]
}

export interface FileAnalyzer {
    getChildren(): any[]
    getLocation(): SourceLocation
}

export interface MethodAnalyzer {
    isMethod(className: String): boolean
    getName(): string
    getClassName(): string
    getLocation(): SourceLocation
    getParameters(): any[]
    getParams(): string[]
}

export interface ModuleAnalyzer {
    isCandidate(): boolean
    getBody(): any[]
    getName(): string
    getLocation(): SourceLocation
    isExported(parentName: string): boolean
}

export interface ParameterAnalyzer {
    getName(): string
    getLocation(): SourceLocation
    withDefaultValue():boolean
}

export interface ValueAnalyzer{
    isPrimitive()
    isObject()
    isArray()
    isNull()
    isProperty()
    getValue()
    getName()
}

export interface Es6MemberAnalyzer {
    getParameters() 
    getType()
    getName()
    isCandidate()
    getLocation()
}