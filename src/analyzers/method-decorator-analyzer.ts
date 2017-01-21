import { SyntaxKind, MetaData, AnalysisType } from "../core"
import * as HP from "./helper"

export class MethodDecoratorAnalyzer {
    constructor(private node) { }

    isDecorator() {
        return HP.getMethodNameFromCallee(this.node.callee) == "__decorate"
            && this.node.arguments.length == 4
    }

    getDecorators(): MetaData[] {
        if (this.isDecorator())
            return HP.getDecorators(this.node.arguments[0])
        else return null;
    }

    getClassName() {
        if (this.isDecorator())
            return this.node.arguments[1].object.name;
        else return null;
    }

    getMethodName() {
        if (this.isDecorator())
            return this.node.arguments[2].value
        else return null;
    }

    getParameters(index: number): MetaData[] {
        if (this.isDecorator())
            return this.getParameterDecorators(this.getMethodName(), index)
        else return null;
    }

    private getParameterDecorators(methodName: string, index: number) {
        let result = [];
        for (let x of this.node.arguments[0].elements) {
            if (HP.getMethodNameFromCallee(x.callee) == "__param"
                && x.arguments[0].value == index) {
                result.push(<MetaData>{
                    type: "Decorator",
                    name: HP.getMethodNameFromCallee(x.arguments[1].callee),
                    analysis: AnalysisType.Valid,
                    children: x.arguments[1].arguments.map(arg => <MetaData>{
                        type: "Parameter",
                        name: HP.getDecoratorParameterName(arg),
                        analysis: AnalysisType.Valid,
                        children: []
                    })
                })
            }
        }
        return result;
    }
}

