const Bridge = artifacts.require("Bridge");

let bridge;

const toTransferObject = tuple => {
    assert.equal(tuple.length, 6, "Transfer contains six items");
    return {
        id: tuple[0],
        sourceAddress: tuple[1],
        value: tuple[2],
        xrplDestinationAddress: tuple[3],
        xrplDestinationTag: tuple[4],
        status: tuple[5]
    };
};

const getBalance = async ({address}) => await web3.eth.getBalance(address).then(parseInt);

contract("Bridge", accounts => {

    before(async () => {
        bridge = await Bridge.deployed();
        let presuiteBalance = await getBalance(bridge);
        assert.equal(presuiteBalance, 0);
    })

    it("should be owned by the deploying address", async () => {
        const owner = await bridge.owner.call()
        assert.equal(owner, accounts[0]);
    });
    
    it("should return empty transfer for nonexistent id", async () => {
        const nullAddress = "0x0000000000000000000000000000000000000000";
        
        const transfer = await bridge.getTransfer.call(0)
                                .then(toTransferObject);

        assert.equal(transfer.id, 0);
        assert.equal(transfer.sourceAddress, nullAddress);
        assert.equal(transfer.value, 0);
        assert.equal(transfer.xrplDestinationAddress, "");
        assert.equal(transfer.xrplDestinationTag, "");
        assert.equal(transfer.status, Bridge.TransferStatus.Started);

        assert.equal(await getBalance(bridge), 0);
    });

    it("should start a transfer with an empty tag when not specified", async () => {
        // Arrange
        const xrplAddr = "rAsDwEr7kfTD9w2To4CQk6UCfuHM9c6GDY";
        const data = {
            from: accounts[1],
            value: 10
        }
        const initialBalance = await getBalance(bridge);

        // Act: start transfer
        const {logs} = await bridge.methods["startTransfer(string)"](xrplAddr, data);

        // Assert: TransferStarted event
        assert.equal(logs.length, 1);
        const startedEvent = logs[0];
        assert.equal(startedEvent.event, "TransferStarted");

        // Assert: bridge balance
        assert.equal(await getBalance(bridge), data.value + initialBalance);

        // Act: get transfer
        const transfer = await bridge.getTransfer(startedEvent.args._id)
                                    .then(toTransferObject);

        // Assert: transfer data
        assert.equal(transfer.id, startedEvent.args._id);
        assert.equal(transfer.sourceAddress, data.from);
        assert.equal(transfer.value, data.value);
        assert.equal(transfer.xrplDestinationAddress, xrplAddr);
        assert.equal(transfer.xrplDestinationTag, "");
        assert.equal(transfer.status, Bridge.TransferStatus.Started);
    });

    it("should start a transfer given an address and tag", async () => {
        // Arrange
        const xrplAddr = "rAsDwEr7kfTD9w2To4CQk6UCfuHM9c6GDY";
        const xrplTag = "1234"
        const data = {
            from: accounts[1],
            value: 10
        }
        const initialBalance = await getBalance(bridge);
        
        // Act: start transfer
        const {logs} = await bridge.startTransfer(xrplAddr, xrplTag, data);

        // Assert: TransferStarted event
        assert.equal(logs.length, 1);
        const startedEvent = logs[0];
        assert.equal(startedEvent.event, "TransferStarted");

        // Assert: bridge balance
        assert.equal(await getBalance(bridge), data.value + initialBalance);


        // Act: get transfer
        const transfer = await bridge.getTransfer(startedEvent.args._id)
                                    .then(toTransferObject);

        // Assert: transfer data
        assert.equal(transfer.id, startedEvent.args._id);
        assert.equal(transfer.sourceAddress, data.from);
        assert.equal(transfer.value, data.value);
        assert.equal(transfer.xrplDestinationAddress, xrplAddr);
        assert.equal(transfer.xrplDestinationTag, xrplTag);
        assert.equal(transfer.status, Bridge.TransferStatus.Started);
    });
})