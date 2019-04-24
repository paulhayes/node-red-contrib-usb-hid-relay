module.exports = function(RED) {
    "use strict";

    const USBRelay = require("@josephdadams/usbrelay"); 

    function RelayNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        var path = relay.device.path;
        node.relay = new USBRelay(config.path);
        
        node.on('input', function(msg) {
            //node.send(msg);
            relay.setState(1, !!msg.payload );
        });

        RED.httpAdmin.get('/usbrelays/' + node.id + '/current', function(req, res, next) {
            res.end(JSON.stringify(path));
            return;
        });
    }
    RED.nodes.registerType("relay node",RelayNode);

    RED.httpAdmin.get('/usbrelays', function(req, res, next) {        
        res.end(JSON.stringify(USBRelay.Relays));
        return;
    });
}