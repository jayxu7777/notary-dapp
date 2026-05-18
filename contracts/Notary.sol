// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

/// @title Notary
/// @notice Immutable on-chain text notarization.
/// @dev No owner, no upgrade path, no selfdestruct, no delegatecall.
///      Once deployed, the contract is immutable by construction.
contract Notary {
    /// @notice Maximum content length in bytes.
    uint256 public constant MAX_LENGTH = 10_000;

    /// @notice author => keccak256(content) => block.timestamp (0 = not stored).
    mapping(address => mapping(bytes32 => uint64)) public records;

    /// @notice Emitted on each successful notarization. Full content lives here.
    event Stored(
        bytes32 indexed contentHash,
        address indexed author,
        uint64 timestamp,
        string content
    );

    error EmptyContent();
    error TooLong();
    error AlreadyStored();

    /// @notice Store a piece of text. Reverts if the same (author, hash) already exists.
    /// @param content UTF-8 text, 1..MAX_LENGTH bytes.
    /// @return contentHash keccak256(content).
    function store(string calldata content) external returns (bytes32 contentHash) {
        uint256 len = bytes(content).length;
        if (len == 0) revert EmptyContent();
        if (len > MAX_LENGTH) revert TooLong();

        contentHash = keccak256(bytes(content));
        if (records[msg.sender][contentHash] != 0) revert AlreadyStored();

        uint64 ts = uint64(block.timestamp);
        records[msg.sender][contentHash] = ts;
        emit Stored(contentHash, msg.sender, ts, content);
    }

    /// @notice Read the timestamp at which `author` notarized `contentHash`.
    /// @return 0 if not stored, otherwise the unix timestamp.
    function timestampOf(address author, bytes32 contentHash) external view returns (uint64) {
        return records[author][contentHash];
    }
}
