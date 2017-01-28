import { SyntaxKind } from "../core"


export class ParameterAnalyzer {
    constructor(private node) { }

    getName() {
        return this.node.name;
    }

    getLocation() {
        return {
            line: this.node.loc.start.line,
            column: this.node.loc.start.column
        };
    }
}