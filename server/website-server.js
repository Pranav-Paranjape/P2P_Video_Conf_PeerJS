/**
 * This script starts a https server accessible at https://localhost:8443
 * to test the chat
 *
 * @author Pranav Paranjape
 */
var fs     = require('fs');
var http   = require('http');
var https  = require('https');
var path   = require("path");
var os     = require('os');
var ifaces = os.networkInterfaces();

// Public Self-Signed Certificates for HTTPS connection
var privateKey  = fs.readFileSync('./../certificates/key.pem', 'utf8');
var certificate = fs.readFileSync('./../certificates/cert.pem', 'utf8');

var credentials = {key: privateKey, cert: certificate};
var express = require('express');
var app = express();

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

/**
 *  Show in the console the URL access for other devices in the network
 */
Object.keys(ifaces).forEach(function (ifname) {
    var alias = 0;

    ifaces[ifname].forEach(function (iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
            // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
            return;
        }
        
        console.log("");
        console.log("Welcome to the Chat Sandbox");
        console.log("");
        console.log("Test the chat interface from this device at : ", "https://localhost:8443");
        console.log("");
        console.log("And access the chat sandbox from another device through LAN using any of the IPS:");
        console.log("Important: Node.js needs to accept inbound connections through the Host Firewall");
        console.log("");

        if (alias >= 1) {
            console.log("Multiple ipv4 addreses were found ... ");
            // this single interface has multiple ipv4 addresses
            console.log(ifname + ':' + alias, "https://"+ iface.address + ":8443");
        } else {
            // this interface has only one ipv4 adress
            console.log(ifname, "https://"+ iface.address + ":8443");
        }

        ++alias;
    });
});

// Allow access from all the devices of the network (as long as connections are allowed by the firewall)
var LANAccess = "0.0.0.0";
// For http
httpServer.listen(8080, LANAccess);
// For https
httpsServer.listen(8443, LANAccess);

// app.get('/', function (req, res) {
//     let p = path.join('..', '/public','/index.html');
//     console.log(p)
//     res.sendFile(p);
// });

// Expose the css and js resources as "resources"
app.use('/resources', express.static('../public/source'));

app.use('/', express.static('../public'));