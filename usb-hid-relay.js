module.exports = function(RED) {
    "use strict";

    const USBRelay = require("usbrelay"); 

    const settings = {
        connectionCheckTime : 5*1000
    };

    let relayNodeName = function(relay){
        
    }

    let checkConnection = function(node){
        let {serial,relayIndex} = node;
        if(typeof(serial)=="undefined"||typeof(relayIndex)=="undefined"){
            node.status({fill:"grey",shape:"dot",text:"not configured"});
        }
        else {
            let allRelays = USBRelay.Relays;
            let device = allRelays.find( (device)=>device.serial==serial );
            if(device){
                node.relay = new USBRelay(device.path);            
                node.status({fill:"green",shape:"dot",text:"connected"});
            }
            else {
                node.status({fill:"red",shape:"dot",text:"disconnected"});
            }
        }       

        setTimeout(checkConnection,settings.connectionCheckTime,node);
    }
    
    function RelayNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        var portInfo = config.usbrelayport.split("_"); //relay.device.path;
        if(portInfo.length==2){
            node.relayIndex = parseInt(portInfo[1]);
            node.serial  = portInfo[0];
        }
        
        checkConnection(node);
        
        node.on('input', function(msg) {
            //node.send(msg);
            if(node.relay)
                node.relay.setState(node.relayIndex+1, !!msg.payload );
        });

        RED.httpAdmin.get('/usbrelays/' + node.id + '/current', function(req, res, next) {
            if(node.relay){
                let relayId = node.relay.getSerialNumber()+"_"+node.relayIndex;
                res.end(JSON.stringify(relayId));
            }
            else 
                res.end(JSON.stringify(""));
            return;
        });
    }
    RED.nodes.registerType("usb relay",RelayNode);

    RED.httpAdmin.get('/usbrelays', function(req, res, next) {        
        res.end(JSON.stringify(USBRelay.Relays));
        return;
    });
}