import { FileAnalyzer } from "./analyzers/file-analyzer"
import { MetaData, ParentMetaData, SyntaxKind, Call, TransformerBase, AnalysisType } from "./core"
import { TsClassTransformer } from "./transformers/ts-class"
import { TsModuleTransformer } from "./transformers/ts-module"
import { TsDecorator } from "./transformers/ts-decorator"
import { TsClassExporterTransformer } from "./transformers/ts-class-export"

export class Transformer {
    constructor(private fileName: string) { }
    transform(ast) {
        let analyzer = new FileAnalyzer(ast)
        let file: ParentMetaData = {
            type: "File",
            name: this.fileName,
            analysis: AnalysisType.Valid,
            children: [],
            location: analyzer.getLocation(),
        }
        let fileTransformer = new FileTransformer()
        fileTransformer.transform(ast, file)
        return file;
    }
}

class FileTransformer extends TransformerBase {
    transform(node, parent: MetaData) {
        let analyzer = new FileAnalyzer(node)
        this.traverse(analyzer.getChildren(), parent, [
            new TsClassTransformer(),
            new TsModuleTransformer(),
            new TsDecorator(),
            new TsClassExporterTransformer()
        ])
    }
}