function Header() {

    this.intLength = 4;

    this.bytesToHeader = (data) => {
        
        var header;
        var length; 
        var srcType;
        var srcCode;
        var dstType;
        var dstCode;

        var idx = 0;

        if (data.length != 20) {
            return null;
        }
        else {
            // right bytes
            length = data.readInt32LE(idx);
            idx += this.intLength;            

            srcType = data.readInt32LE(idx);
            idx += this.intLength;    
                  
            srcCode = data.readInt32LE(idx);
            idx += this.intLength;     
                 
            dstType = data.readInt32LE(idx);
            idx += this.intLength;     
                 
            dstCode = data.readInt32LE(idx);
            idx += this.intLength;       

            header = { "length": length, "srcType": srcType, "srcCode": srcCode, "dstType": dstType, "dstCode": dstCode };
            return header;
        }
    }// end method
}

module.exports = new Header();