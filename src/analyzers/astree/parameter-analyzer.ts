import { SyntaxKind, SourceLocation } from "../../core"


export class ParameterAnalyzer {
    constructor(private node) { }

    getName() {
        return this.node.name;
    }

    getLocation() {
        return <SourceLocation> {
            start: this.node.start,
            end: this.node.end
        };
    }
}