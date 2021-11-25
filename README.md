<!-- This CSS is only included in the rendered docs.html of the server -->
<!-- PASTE INTO docs.html WHEN REGENERATING -->
<!-- 
<style type="text/css">
    body {
        max-width: 700px;
        margin: auto;
        font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    }

    h2 {
        margin-top: 50px;
        margin-bottom: 20px;
        padding-bottom: 5px;
        border-bottom: 1px lightgray solid;
    }

    h3 {
        margin-top: 20px;
    }



    ul {
        margin-bottom: 40px;
    }

    li ul {
        margin-bottom:  0px;
    }
</style> 
-->

<div align="center">
    <a href="https://mateffy.me/mission-control-project">
        <img src="resources/icon-web.png">
    </a>
    <h1>GPIO <i>Bridge Server</i></h1>
    <p>
        This server offers a HTTP interface to control GPIO outputs on a Raspberry Pi, specifically to transmit 433Mhz signals.
    </p>
    <p>
        Built for use with <a href="https://github.com/homebridge/homebridge">Homebridge</a> and <a href="https://mission-control.js.org">Mission Control</a>
    </p>
</div>

<br>

## Features
- Accepts HTTP requests to send 433Mhz data
    - Currently works with Intertechno wireless outlets but can be adapted to send any 433Mhz codes
- Send RGB data to Bluetooth Low Energy (BLE) devices
    - Currently RGB controllers with the _QHM-D461_ chipset are supported
    - [`ble-led-driver`](https://github.com/capevace/ble-led-driver) is used which requires `gatttool` internally
- Pass `--debug` for easier development of BLE modes

## CLI
```sh
node src/index.js [IR_DEVICE_HOST] [IR_DEVICE_PORT]
``` 
- IR_DEVICE_HOST - *The IP of the Arduino*
- IR_DEVICE_PORT - *The port of the Arduino*

## 433Mhz route
### `/433mhz/:CODE/:STATE`
Send an intertechno 433Mhz code using the attached 433Mhz transmitter.

- CODE (String) - *The intertechno code (e.g. 'A1' or 'C3')*
- STATE (String) - *`on` or `off`*

## Infrared routes
### `/infrared/nec/:ADDRESS/:COMMAND`
Send an NEC infrared signal to the Arduino provided in arguments.
- ADDRESS (HEX/Decimal) - *The NEC address (most likely `0x0`)*
- COMMAND (HEX/Decimal) - *The NEC command*

### `/infrared/device/:DEVICE/:COMMAND`

Send a preconfigured IR command for a given device.
- DEVICE (String) - *The device to target (`panasonic`)*
- COMMAND (String) - *The command name (`ONOFF`)*

## BLE Routes (`/ble` and `/qhm-d461`)

### `/ble/rgb/:R/:G/:B`
Set a color to be displayed.

This will put the driver in mode 'solid' so active modes are paused.

- R, G, B (0...255) - *RGB color values*

### `/ble/mode/rainbow?speed=1`
Enable Rainbow mode (by rotating hue)


**Query**
- speed (int) Number of hue rotations per second

### `/ble/mode/random?speed=1`
Enable Random mode


**Query**
- speed (int) Seconds between color changes

### `/ble/restart`
Restart the custom RGB LED driver


## Changelog
### 1.2.0
- Added `bridge-server` CLI command to `package.json`

### 1.1.0
- Added `/ble/restart` route

### 1.0.0
- Stable release