// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var packet = packet || {};

/**
 * @enum
 */
packet.Command = {
    MATCH_REQUEST: 0,
    MATCH_COMPLET: 1,
    LATENCY: 2,
    HEALTH_CHECK: 3,
    MSLIST_REQUEST: 4,
    PG_START: 5,
    PG_END: 6,
    PG_DUMMY: 7,
    ROOM_CREATE_REQUEST: 8,
    ROOM_CREATE_RESPONSE: 9,
    ROOM_JOIN_REQUEST: 10,
    ROOM_JOIN_RESPONSE: 11,
    GAME_START: 12,
    GAME_END: 13
};

/**
 * @enum
 */
packet.Status = {
    SUCCESS: 0,
    FAIL: 1,
    NONE: 2
};

/**
 * @constructor
 */
packet.Body = function () {
    /**
     * @type {flatbuffers.ByteBuffer}
     */
    this.bb = null;

    /**
     * @type {number}
     */
    this.bb_pos = 0;
};

/**
 * @param {number} i
 * @param {flatbuffers.ByteBuffer} bb
 * @returns {packet.Body}
 */
packet.Body.prototype.__init = function (i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {packet.Body=} obj
 * @returns {packet.Body}
 */
packet.Body.getRootAsBody = function (bb, obj) {
    return (obj || new packet.Body).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {packet.Command}
 */
packet.Body.prototype.cmd = function () {
    var offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? /** @type {packet.Command} */ (this.bb.readInt32(this.bb_pos + offset)) : packet.Command.MATCH_REQUEST;
};

/**
 * @returns {packet.Status}
 */
packet.Body.prototype.status = function () {
    var offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? /** @type {packet.Status} */ (this.bb.readInt32(this.bb_pos + offset)) : packet.Status.SUCCESS;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array}
 */
packet.Body.prototype.data = function (optionalEncoding) {
    var offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
packet.Body.startBody = function (builder) {
    builder.startObject(3);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {packet.Command} cmd
 */
packet.Body.addCmd = function (builder, cmd) {
    builder.addFieldInt32(0, cmd, packet.Command.MATCH_REQUEST);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {packet.Status} status
 */
packet.Body.addStatus = function (builder, status) {
    builder.addFieldInt32(1, status, packet.Status.SUCCESS);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} dataOffset
 */
packet.Body.addData = function (builder, dataOffset) {
    builder.addFieldOffset(2, dataOffset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
packet.Body.endBody = function (builder) {
    var offset = builder.endObject();
    return offset;
};

// Exports for Node.js and RequireJS
this.packet = packet;
