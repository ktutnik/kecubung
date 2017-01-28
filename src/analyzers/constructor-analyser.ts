import * as Core from "../core"


export class ConstructorAnalyzer {
    constructor(private node) { }

    isConstructor(className: string) {
        return this.node.type == Core.SyntaxKind.FunctionDeclaration
            && this.node.id.name == className;
    }

    getName() {
        return this.node.id.name;
    }

    getLocation() {
        return {
            line: this.node.loc.start.line,
            column: this.node.loc.start.column
        };
    }

    getParameters(){
        return this.node.params;
    }
}