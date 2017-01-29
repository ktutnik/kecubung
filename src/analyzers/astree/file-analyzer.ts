import { SyntaxKind, SourceLocation } from "../../core"


export class FileAnalyzer {
    constructor(private node) { }

    getChildren(){
        return this.node.program.body;
    }

    getLocation() {
        return <SourceLocation> {
            start: this.node.start,
            end: this.node.end
        };
    }
}