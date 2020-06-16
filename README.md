<div align="center">
    <a href="https://mateffy.me/mission-control-project">
        <img src="resources/icon-web.png">
    </a>
    <h1>Mission Control <i>Bridge Server</i></h1>
    <p>
        This server offers a HTTP interface to control GPIO outputs on a Raspberry Pi, specifically to transmit 433Mhz signals.
    </p>
    <p>
        <a href="https://mateffy.me/mission-control-bridge-server">More about Mission Control</a>
    </p>
</div>

<br>

## Features
- Accepts HTTP requests to send 433Mhz data
- Currently works with Intertechno wireless outlets but can be adapted to send any 433Mhz codes 


### Planned State Service
Currently the server is pretty dumb, as it simply does what you tell it to do (turn on/off). It doesn't keep any state so we can't tell it to _toggle_ the outlet - the server doesn't yet know what state the outlet is in.

The state service will probably live in the mission-control-core instead.
