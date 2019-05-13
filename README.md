## Node Red - USB HID Relay Nodes

Allows control of cheap hid relays in node js. HID relays do not show up as COM ports. Instead they are HID devices, and have an internal serial number which can be used to differenciate them. These devices are far suppior to their Virtual COM port counterparts.

Models supports:
HW-348
HW-343

![](usb%20hid%20relay%20screenshot%202.png)

### Installation
todo

### Usage

* Plug in your usb relay
* Add a output->"usb relay" node to you node-red project.
* Double click the node, and select the relay from the drop down list*. 
* Send a message to the node, with either msg.payload equal to ```true``` to turn on, and ```false``` to turn off.

**note devices with more than one relay have multiple entries in the drop down* 


