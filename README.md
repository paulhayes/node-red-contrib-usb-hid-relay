## Node Red - USB HID Relay Nodes
![](usb%20hid%20relay%20screenshot%202.png)

Allows control of cheap hid relays in node red. HID relays do not show up as COM port devices. Instead they are HID devices, and have an internal serial number which can be used to differenciate them. These devices are far suppior to their Virtual COM port counterparts.

Models supported:
* HW-348
* HW-343
* HW-341
* Models with USB-Relay-1, USB-Relay-2 or USB-Relay-4 printed on the PCB

![](HW-343.jpg)

### Installation

In node red, via libraries search for USB-HID-relay. Select and hit install. If this fails, please report to issue's on the projects GitHub page.

#### Linux Dependancies
For linux you will need to make sure you install some additional libraries. For debian and raspbian this should be done with the following:
```sudo apt-get install libudev-dev librtlsdr-dev libusb-1.0-0-dev libpthread-stubs0-dev git```

You will also need to add udev rules. Create the following file ```/etc/udev/rules.d/50-hidrelay.rules```. This allows node-red the permissions to commuincate with the device directly.

```
SUBSYSTEM=="input", GROUP="input", MODE="0666"
SUBSYSTEM=="usb", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05df", MODE:="666", GROUP="plugdev"
KERNEL=="hidraw*", ATTRS{idVendor}=="16c0", ATTRS{idProduct}=="05df", MODE="0666", GROUP="plugdev"
```

### Usage

* Plug in your usb relay
* Add a output->"usb relay" node to you node-red project.
* Double click the node, and select the relay from the drop down list*. 
* Send a message to the node, with either msg.payload equal to ```true``` to turn on, and ```false``` to turn off.

**note devices with more than one relay have multiple entries in the drop down* 


