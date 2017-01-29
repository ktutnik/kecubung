import { SyntaxKind, MethodMetaData, MetaData, AnalysisType, SourceLocation } from "../core"

export type ParserType = "ASTree" | "Acorn"
export enum AnalyzerType {
    File, Decorator, ChildDecorator, TSClass, TSModule, Constructor, Method, Parameter
}

export interface ChildDecoratorAnalyzer {
    isMethodDecorator(): boolean
    isParameterDecorator(): boolean
    getMethodName(): string
    getMethodLocation(): SourceLocation
    getMethodParameters(): MetaData[]
    getParameterDecoratorName(): string
    getParameterDecoratorLocation(): SourceLocation
    getParameterDecoratorParameters(): MetaData[]
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
    getClassName(): string
    getMethodName(): string
    isClassDecorator(): boolean
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
}