import { SyntaxKind, SourceLocation } from "../../core"
import { ClassAnalyzer } from "./class-analyzer"

export class Es6MemberAnalyzer {

    constructor(private node) { }

    getParameters() {
        return this.node.params;
    }

    getType() {
        switch (this.node.kind) {
            case "constructor":
                return "Constructor"
            case "method":
                return "Method"
        }
    }

    getName() {
        return this.node.key.name;
    }

    isCandidate() {
        return this.node.type == SyntaxKind.ClassMethod
    }

    getLocation() {
        return <SourceLocation>{
            start: this.node.start,
            end: this.node.end
        };
    }
}

