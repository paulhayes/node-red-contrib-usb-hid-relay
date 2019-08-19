// the following should throw an error is there's an issue with the usbrelay library
const USBRelay = require("@josephdadams/usbrelay"); 

relayList = USBRelay.Relays;

if(!Array.isArray(relayList)){
    throw new Error("Expected array from Relays getter");
}
