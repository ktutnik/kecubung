import * as Core from "../../core"


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
        return <Core.SourceLocation> {
            start: this.node.start,
            end: this.node.end
        };
    }

    getParameters(){
        return this.node.params;
    }
}