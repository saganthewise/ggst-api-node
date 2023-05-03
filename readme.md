# Nodejs Api wrapper for Guilty Gear Strive

ggst-api-node is a module for connecting with GGST api.
Install it with npm:

    npm install ggst-api-node

Require it in your project:

```javascript
const ggstApi = require('ggst-api-node')
```
If you want to use the login method to retrive username and strive ID you should use **SteamID64**.


It isn't currently 100% clear how the API because of the lack of documentation.

## Credits/Sources
For contribution to the repo and maintenance: @TheProgDog
This repository is heavily based on other api wrappers for rust and python such as:  
[GitHub - UnknownMemory/ggst-api: Guilty Gear Strive API wrapper](https://github.com/UnknownMemory/ggst-api)  
[GitHub - halvnykterist/ggst-api-rs: A library for interfacing with the REST API of Guilty Gear Strive](https://github.com/halvnykterist/ggst-api-rs)