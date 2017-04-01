
namespace Module {
    export class MyClass {

        myProp: string;

        myNumber: number;

        myMethod() { }
    }
}

export class MyClass extends Module.MyClass {
    constructor(par1) { super() }
    myMethod() { }
}