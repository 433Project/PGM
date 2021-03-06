// automatically generated by the FlatBuffers compiler, do not modify

/**
 * @const
 * @namespace
 */
var fb = fb || {};

/**
 * @enum
 */
fb.COMMAND = {
    HEALTH_CHECK: 0,
    NOTI_MATCH_REQUEST: 10,
    NOTI_MATCH_SUCCESS: 11,
    LATENCY: 12,
    MATCH_REQUEST: 13,
    MATCH_RESPONSE: 14,
    MSLIST_REQUEST: 30,
    MSLIST_RESPONSE: 31,
    MS_ID: 32,
    ROOM_CREATE_REQUEST: 40,
    ROOM_CREATE_RESPONSE: 41,
    ROOM_JOIN_REQUEST: 50,
    ROOM_JOIN_RESPONSE: 51,
    GAME_START: 52,
    GAME_END: 53,
    PG_START: 60,
    PG_END: 61,
    PG_DUMMY: 62
};

/**
 * @enum
 */
fb.STATUS = {
    SUCCESS: 0,
    FAIL: 1,
    NONE: 2
};

/**
 * @constructor
 */
fb.Body = function () {
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
 * @returns {fb.Body}
 */
fb.Body.prototype.__init = function (i, bb) {
    this.bb_pos = i;
    this.bb = bb;
    return this;
};

/**
 * @param {flatbuffers.ByteBuffer} bb
 * @param {fb.Body=} obj
 * @returns {fb.Body}
 */
fb.Body.getRootAsBody = function (bb, obj) {
    return (obj || new fb.Body).__init(bb.readInt32(bb.position()) + bb.position(), bb);
};

/**
 * @returns {fb.COMMAND}
 */
fb.Body.prototype.cmd = function () {
    var offset = this.bb.__offset(this.bb_pos, 4);
    return offset ? /** @type {fb.COMMAND} */ (this.bb.readInt32(this.bb_pos + offset)) : fb.COMMAND.HEALTH_CHECK;
};

/**
 * @returns {fb.STATUS}
 */
fb.Body.prototype.status = function () {
    var offset = this.bb.__offset(this.bb_pos, 6);
    return offset ? /** @type {fb.STATUS} */ (this.bb.readInt32(this.bb_pos + offset)) : fb.STATUS.SUCCESS;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array}
 */
fb.Body.prototype.data1 = function (optionalEncoding) {
    var offset = this.bb.__offset(this.bb_pos, 8);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Encoding=} optionalEncoding
 * @returns {string|Uint8Array}
 */
fb.Body.prototype.data2 = function (optionalEncoding) {
    var offset = this.bb.__offset(this.bb_pos, 10);
    return offset ? this.bb.__string(this.bb_pos + offset, optionalEncoding) : null;
};

/**
 * @param {flatbuffers.Builder} builder
 */
fb.Body.startBody = function (builder) {
    builder.startObject(4);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {fb.COMMAND} cmd
 */
fb.Body.addCmd = function (builder, cmd) {
    builder.addFieldInt32(0, cmd, fb.COMMAND.HEALTH_CHECK);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {fb.STATUS} status
 */
fb.Body.addStatus = function (builder, status) {
    builder.addFieldInt32(1, status, fb.STATUS.SUCCESS);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} data1Offset
 */
fb.Body.addData1 = function (builder, data1Offset) {
    builder.addFieldOffset(2, data1Offset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} data2Offset
 */
fb.Body.addData2 = function (builder, data2Offset) {
    builder.addFieldOffset(3, data2Offset, 0);
};

/**
 * @param {flatbuffers.Builder} builder
 * @returns {flatbuffers.Offset}
 */
fb.Body.endBody = function (builder) {
    var offset = builder.endObject();
    return offset;
};

/**
 * @param {flatbuffers.Builder} builder
 * @param {flatbuffers.Offset} offset
 */
fb.Body.finishBodyBuffer = function (builder, offset) {
    builder.finish(offset);
};

// Exports for Node.js and RequireJS
this.fb = fb;