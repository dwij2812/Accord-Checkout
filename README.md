# Accord-Checkout

[![made-with-nodejs](https://img.shields.io/badge/Made%20with-Node.js-green.svg?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
![Depfu](https://img.shields.io/depfu/dwij2812/Accord-Checkout.svg?style=for-the-badge)


[![HitCount](http://hits.dwyl.io/dwij2812/Accord-Checkout.svg)](http://hits.dwyl.io/dwij2812/Accord-Checkout)


A Minimal Inventory Management and Part tracking system for Accordians built using Node.JS

## Features

#### For Users

  - Users can make accounts using Signup page and the use the Sign-in page to log on into the account.
  - Login Sessions are maintained so no need to login every time if you use them frequently.
  - Users can search for parts in the inventory using any attributes like model number, product make(brand), product name etc.
  - Users can mark their favorite parts so they can appear above others every time.
  -  Borrow parts from the inventory by click of a button for up to 30 days.
  -  User can view the entire transaction log of the parts that were issued by him/her at any given point of time using this system.
  -  For return of any part the user can create create return requests which will be approved by the administrator upon successful return of the parts.

#### For Administrators
  - Add/Delete/Edit parts in the inventory.
  - Create new user accounts.
  - View borrow history either based on per part or sorted based on a particular user.
  - Issue parts to the user directly for any number of days and the same reflects in user account upon confirmation.
  - Approve return requests created by the users to complete the return of a part back into the inventory after use.

## Instructions to Run Checkout

1. Install NodeJS(v10.0 or Above): [NodeJS Downloads Page](https://nodejs.org/en/download/)
2. Install MongoDB (v4.0 or Above): [MongoDB Downloads Page](https://www.mongodb.com/download-center/community)
   
   #### Additional Setup Needed For Windows Users
     -  Install Visual C++ Build Environment: [Visual Studio Build Tools](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=BuildTools)
   (using "Visual C++ build tools" workload) or [Visual Studio 2017 Community](https://visualstudio.microsoft.com/pl/thank-you-downloading-visual-studio/?sku=Community)
   (using the "Desktop development with C++" workload).
   
   - Launch cmd and type  **`$ npm config set msvs_version 2017`.**
   - Upon Successful completion of the sbove steps we will configure node-gyp to use the C++ Buil-Tools using Microsoft's [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) using **`$ npm install --global --production windows-build-tools`** from an elevated PowerShell or CMD.exe (run as Administrator).

3. We will Install all the dependencies (node_modules) required for the app using the command **`$ npm install`**

4. Start MongoDB compass and connect to the MongoDB Server on its Default Port.
5. Now Navigate to the Project's Root Directory and launch the app using the command `node index`.
6. The App will now start and the PORT where the app will listen will be printed in the terminal.
7. To access the app use the address: `http://[HOST_SERVER_IP_ADDRESS]:[PORT_NUMBER]` with any web browser.
8. Use Signup Option to create New Users and to make a user as the administrator use MongoDB Compass and Navigate to **inventory_system** database **Users** collection and set the isAdmin field to True in the corresponding Document to the intended user.
9. App logs can be found in the logs folder once the application is running.
10. Also for viewing logs in real-time we are using winston logger in the application terminal to display all the requests and also colorize it to show the severity and the types of errors.
