import { SyntaxKind } from "../core"


export class FileAnalyzer {
    constructor(private node) { }

    getChildren(){
        return this.node.program.body;
    }

    getLocation() {
        return {
                line: this.node.loc.start.line,
                column: this.node.loc.start.column
            };
    }
}