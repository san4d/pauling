const Bridge = artifacts.require("Bridge");

contract("Bridge", _accounts => {
    it("should say hello", () =>
        Bridge.deployed()
            .then(instance => instance.hello())
            .then(msg => assert.equal(msg, "hello")));
    }
);