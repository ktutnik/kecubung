function decoOne() {
    return function (...args) { };
}

function decoTwo(param: string) {
    return function (...args) { };
}

export module MyModule {

    export class MyBaseClass {
        baseMethod(par1) { }
    }

    @decoTwo("halo")
    export class MyClass extends MyBaseClass {
        constructor() { super() }
        @decoOne()
        myMethod( @decoOne() par1) { }
    }
}

