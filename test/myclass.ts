function decoOne() {
    return function(...args) { };
}

function decoTwo(param: string) {
    return function(...args) { };
}

export module MyModule {

    export class MyBaseClass {
        constructor() { }
        @decoOne()
        myMethod( @decoOne() par1) { }
    }
    export module ChildModule {
        export class ChildClass extends MyBaseClass {
            childMethod() { }
        }
    }

}

@decoOne()
export class MyClass extends MyModule.MyBaseClass {
    constructor() { super() }
    @decoOne()
    myMethod( @decoOne() par1) { }
}
