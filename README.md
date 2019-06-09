# Accord-Checkout
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Dependency Status](https://david-dm.org/dwij2812/Accord-Checkout.svg?style=flat)](https://david-dm.org/dwij2812/Accord-Checkout)
[![HitCount](http://hits.dwyl.io/dwij2812/Accord-Checkout.svg)](http://hits.dwyl.io/dwij2812/Accord-Checkout)

A Minimal Inventory Management and Part tracking system for Accordians built using Node.JS

## Instructions to Run Checkout

1. Install NodeJS(v10.0 or Above): [NodeJS Downloads Page](https://nodejs.org/en/download/)
2. Install MongoDB (v4.0 or Above): [MongoDB Downloads Page](https://www.mongodb.com/download-center/community)
   
   #### Additional Setup Needed For Windows Users
     -  Install Visual C++ Build Environment: [Visual Studio Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools)
   (using "Visual C++ build tools" workload) or [Visual Studio 2017 Community](https://visualstudio.microsoft.com/pl/thank-you-downloading-visual-studio/?sku=Community)
   (using the "Desktop development with C++" workload).
   
   - Launch cmd and type  `$ npm config set msvs_version 2017`.
   - Upon Successful completion of the sbove steps we will configure node-gyp to use the C++ Buil-Tools using Microsoft's [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) using `$ npm install --global --production windows-build-tools` from an elevated PowerShell or CMD.exe (run as Administrator).

3. We will Install all the dependencies (node_modules) required for the app using the command `$ npm install`

4. Start MongoDB compass and connect to the MongoDB Server on its Default Port.
5. Now Navigate to the Project's Root Directory and launch the app using the command `node index`.
6. The App will now start and the PORT where the app will listen will be printed in the terminal.
7. To access the app use the address: `http://[HOST_SERVER_IP_ADDRESS]:[PORT_NUMBER]` with any web browser.
8. Use Signup Option to create New Users and to make a user as the administrator use MongoDB Compass and Navigate to **inventory_system** database **Users** collection and set the isAdmin field to True in the corresponding Document to the intended user.
