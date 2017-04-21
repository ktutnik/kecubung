import { SyntaxKind, SourceLocation } from "../../core"


export class ParameterAnalyzer {
    constructor(private node) { }

    withDefaultValue(){
        return this.node.type == SyntaxKind.AssignmentPattern
    }

    getName() {
        if(this.withDefaultValue())
            return this.node.left.name
        else return this.node.name;
    }

    getLocation() {
        return <SourceLocation> {
            start: this.node.start,
            end: this.node.end
        };
    }
}