const Buffer = require('buffer').Buffer;

function genToken() {
    const date = Date.now().toString();
    const base64Date = Buffer.from(date).toString('base64');
    const base64url = base64Date
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
    return base64url;
}

module.exports = { genToken };
