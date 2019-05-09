module.exports = function(RED) {
    "use strict";

    console.log("test");
    const USBRelay = require("usbrelay"); 

    let relayNodeName = function(relay){
        
    }

    
    function RelayNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        var portInfo = config.usbrelayport.split("_"); //relay.device.path;
        let allRelays = USBRelay.Relays;
        
        if(portInfo.length==2){
            let device = allRelays.find( (device)=>device.serial==portInfo[0] );
            if(device){
                node.port = parseInt(portInfo[1]);
                node.relay = new USBRelay(device.path);            
            }
        }
        else{
            try{
                node.relay = new USBRelay();
            }
            catch(e){

            }
        }
        
        
        node.on('input', function(msg) {
            //node.send(msg);
            if(node.relay)
                node.relay.setState(node.port+1, !!msg.payload );
        });

        RED.httpAdmin.get('/usbrelays/' + node.id + '/current', function(req, res, next) {
            if(node.relay)
                res.end(JSON.stringify(node.relay.getSerialNumber()+"_"+node.port));
            else 
                res.send(JSON.stringify(""));
            return;
        });
    }
    RED.nodes.registerType("usb relay",RelayNode);

    RED.httpAdmin.get('/usbrelays', function(req, res, next) {        
        res.end(JSON.stringify(USBRelay.Relays));
        return;
    });
}