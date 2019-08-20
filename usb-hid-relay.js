module.exports = function(RED) {
    "use strict";

    const USBRelay = require("usbrelay"); 

    const settings = {
        connectionCheckTime : 5*1000
    };

    let relayNodeName = function(relay){
        
    }

    let relayList;
    let relayListTime;

    let checkConnection = function(node){
        if(node.isClosed){
            return;
        }
        let {serial,relayIndex} = node;
        if(typeof(serial)=="undefined"||typeof(relayIndex)=="undefined"){
            node.status({fill:"grey",shape:"dot",text:"not configured"});
        }
        else {
            if(!relayList || (Date.now()-relayListTime)>settings.connectionCheckTime){
                relayList = USBRelay.Relays;
                relayListTime = Date.now();
            }
            let device = relayList.find( (device)=>device.serial==serial );
            let connectionSuccess = false;
            if(device){
                try{
                    node.relay = new USBRelay(device.path);            
                    connectionSuccess = true;
                }
                catch(e){
                    connectionSuccess = false;
                }
            }
            if(connectionSuccess){
                node.status({fill:"green",shape:"dot",text:"connected"});
            }
            else {
                node.status({fill:"red",shape:"dot",text:"disconnected"});
            }
        }       

        node.checkConnectionTimeout = setTimeout(checkConnection,settings.connectionCheckTime,node);
    }
    
    function RelayNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        var portInfo = config.usbrelayport.split("_"); //relay.device.path;
        if(portInfo.length==2){
            node.relayIndex = parseInt(portInfo[1]);
            node.serial  = portInfo[0];
        }
        else {
            console.error("usb hid relay config not found");
        }
        
        checkConnection(node);
        
        node.on('input', function(msg) {
            if(node.relay){
                try{
                    node.relay.setState(node.relayIndex+1, !!msg.payload );
                }
                catch(e){
                    delete node.relay;
                }
            }
        });

        node.on('close',function(removed,done){
            if(node.checkConnectionTimeout){
                clearTimeout(node.checkConnectionTimeout);
            }
            if(node.relay){
                delete node.relay;
            }
            node.isClosed = true;
            done();
        });

        RED.httpAdmin.get('/usbrelays/' + node.id + '/current', function(req, res, next) {
            if(node.serial){
                let relayId = node.serial+"_"+node.relayIndex;
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
