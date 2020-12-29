// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Bridge {
    enum TransferStatus {Started, Succeeded, Failed}

    struct Transfer {
        uint id;
        address sourceAddress;
        uint value;
        string xrplDestinationAddress;
        string xrplDestinationTag;
        TransferStatus status;
    }

    event TransferStarted(uint _id);

    address payable public owner;
    uint numTransfers;
    mapping(uint => Transfer) transfersById;

    constructor() {
        owner = payable(msg.sender);
    }

    function getTransfer(uint _id) public view returns (Transfer memory) {
		return transfersById[_id];
	}

    ///
    /// Start a transfer
    ///

    function startTransfer(string memory _xrplAddress, string memory _xrplTag) payable public {
        startTransfer(_xrplAddress, _xrplTag, msg.sender, msg.value);
    }

    function startTransfer(string memory _xrplAddress) payable public {
        startTransfer(_xrplAddress, "", msg.sender, msg.value);
    }

    function startTransfer(
        string memory _xrplAddress, 
        string memory _xrplTag,
        address _sourceAddress,
        uint _value
    ) internal {
        Transfer storage transfer = transfersById[++numTransfers];

        transfer.id = numTransfers;
        transfer.sourceAddress = _sourceAddress;
        transfer.value = _value;
        transfer.xrplDestinationAddress = _xrplAddress;
        transfer.xrplDestinationTag = _xrplTag;
        transfer.status = TransferStatus.Started;

        emit TransferStarted(transfer.id);
    }
}
