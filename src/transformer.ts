import * as Analyzer from "./analyzers"
import { MetaData, ParentMetaData, SyntaxKind, Call, TransformerBase, AnalysisType } from "./core"
import { TsClassTransformer } from "./transformers/ts-class"
import { TsModuleTransformer } from "./transformers/ts-module"
import { TsDecorator } from "./transformers/ts-decorator"
import { TsClassExporterTransformer } from "./transformers/ts-class-export"

export class Transformer {
    constructor(private fileName: string, private parser:Analyzer.ParserType) { }
    transform(ast) {
        let analyzer = <Analyzer.FileAnalyzer>Analyzer
            .get(this.parser, Analyzer.AnalyzerType.File, ast)
        let file: ParentMetaData = {
            type: "File",
            name: this.fileName,
            analysis: AnalysisType.Valid,
            children: [],
            location: analyzer.getLocation(),
        }
        let fileTransformer = new FileTransformer(this.parser)
        fileTransformer.transform(ast, file)
        return file;
    }
}

class FileTransformer extends TransformerBase {
    constructor(private parserType: Analyzer.ParserType) {
        super()
    }
    
    transform(node, parent: MetaData) {
        let analyzer = <Analyzer.FileAnalyzer>Analyzer
            .get(this.parserType, Analyzer.AnalyzerType.File, node)
        this.traverse(analyzer.getChildren(), parent, [
            new TsClassTransformer(this.parserType),
            new TsModuleTransformer(this.parserType),
            new TsDecorator(this.parserType),
            new TsClassExporterTransformer(this.parserType)
        ])
    }
}