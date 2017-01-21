import { Visitor, Call, MetaData, MetaDataFactory } from "../core"
import { ClassVisitor } from "./class-visitor"
import { ModuleVisitor } from "./module-visitor"
import { ClassDecoratorVisitor } from "./class-decorator-visitor"
import { MethodDecoratorVisitor } from "./method-decorator-visitor"

export type CallLocation = "start" | "exit"

export class AggregatorStore {
    start: { [key: string]: CallAggregator } = {}
    exit: { [key: string]: CallAggregator } = {}
}

export class CallAggregator {
    visitors: Visitor[] = []
    constructor(private location: CallLocation) { }

    addVisitor(visitor: Visitor) {
        this.visitors.push(visitor)
    }

    visit(node, meta: MetaData, metaParent: MetaData) {
        for (let visit of this.visitors) {
            let result = visit[this.location](node, meta, metaParent)
            if (result) return result;
        }
        return null;
    }
}

export class VisitorAggregator implements Visitor {
    store: AggregatorStore = new AggregatorStore();

    constructor(private visitors: Visitor[]) {
        this.visitors.forEach(visitor => {
            this.initAggregator(visitor, "start")
            this.initAggregator(visitor, "exit")
        })
    }

    private initAggregator(visitor: Visitor, location: CallLocation) {
        let options = Call.getWhen(visitor, location);
        if (options) {
            options.forEach(syntaxKind => {
                if (!this.store[location][syntaxKind])
                    this.store[location][syntaxKind] = new CallAggregator(location);
                this.store[location][syntaxKind].addVisitor(visitor);
            })
        }
    }

    private visit(location: CallLocation, node, meta: MetaData, metaParent: MetaData) {
        let aggregator = this.store[location][node.type]
        if (aggregator) return aggregator.visit(node, meta, metaParent)
        return null;
    }

    start(node, meta: MetaData, metaParent: MetaData): MetaData {
        return this.visit("start", node, meta, metaParent);
    }

    exit(node, meta: MetaData, metaParent: MetaData): MetaData {
        return this.visit("exit", node, meta, metaParent);
    }
}

export module VisitorRegistry {
    export function getVisitor(factory: MetaDataFactory) {
        return new VisitorAggregator([
            new ClassVisitor(factory),
            new ModuleVisitor(factory),
            new ClassDecoratorVisitor(factory),
            new MethodDecoratorVisitor(factory)
        ])
    }
}
