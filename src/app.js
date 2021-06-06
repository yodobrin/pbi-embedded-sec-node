/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const express = require("express");
const exphbs = require("express-handlebars");
const msal = require("@azure/msal-node");

const policies = require("./policies");
let path = require('path');
require('dotenv').config();
let embedToken = require(__dirname + '/embedConfigService.js');
const utils = require(__dirname + "/utils.js");

const SERVER_PORT = process.env.PORT || 3000; 

/**
 * Confidential Client Application Configuration
 */
const confidentialClientConfig = {
    auth: {
        clientId:  process.env.login_clientID,
        authority: process.env.authorityLogin, 
        clientSecret: process.env.login_clientSecret,
        redirectUri: process.env.redirectUrl,
    },
    system: {
        loggerOptions: {
            loggerCallback(loglevel, message, containsPii) {
                console.log(message);
            },
            piiLoggingEnabled: false,
            logLevel: msal.LogLevel.Verbose,
        }
    }
};



const SCOPES = {
    pbi: ["user.read"],
    oidc: ["openid", "profile"],
}

/**
 * The MSAL.js library allows you to pass your custom state as state parameter in the Request object
 * By default, MSAL.js passes a randomly generated unique state parameter value in the authentication requests.
 * The state parameter can also be used to encode information of the app's state before redirect. 
 * You can pass the user's state in the app, such as the page or view they were on, as input to this parameter.
 * For more information, visit: https://docs.microsoft.com/azure/active-directory/develop/msal-js-pass-custom-state-authentication-request
 */
const APP_STATES = {
    login: "login",

}

/** 
 * Request Configuration
 * We manipulate these two request objects below 
 * to acquire a token with the appropriate claims.
 */
const authCodeRequest = {
    redirectUri: confidentialClientConfig.auth.redirectUri,
    state:APP_STATES.login,
};

const tokenRequest = {
    redirectUri: confidentialClientConfig.auth.redirectUri,
};

// Initialize MSAL Node
const cca = new msal.ConfidentialClientApplication(confidentialClientConfig);

// Create an express instance
const app = express();
// Required for pbi embedded
app.use('/js', express.static('./node_modules/bootstrap/dist/js/')); // Redirect bootstrap JS
app.use('/js', express.static('./node_modules/jquery/dist/')); // Redirect JS jQuery
app.use('/js', express.static('./node_modules/powerbi-client/dist/')) // Redirect JS PowerBI
app.use('/css', express.static('./node_modules/bootstrap/dist/css/')); // Redirect CSS bootstrap
app.use('/public', express.static('./public/')); // Use custom JS and CSS files

// Store accessToken in memory
app.locals.accessToken = null;

// Set handlebars view engine
app.engine(".hbs", exphbs({ extname: ".hbs" }));
app.set("view engine", ".hbs");

/**
 * This method is used to generate an auth code request
 * @param {string} authority: the authority to request the auth code from 
 * @param {array} scopes: scopes to request the auth code for 
 * @param {string} state: state of the application
 * @param {object} res: express middleware response object
 */
const getAuthCode = (authority, scopes, state, res) => {

    // prepare the request
    authCodeRequest.authority = authority;
    authCodeRequest.scopes = scopes;
    authCodeRequest.state = state;

    tokenRequest.authority = authority;

    // request an authorization code to exchange for a token
    return cca.getAuthCodeUrl(authCodeRequest)
        .then((response) => {
            res.redirect(response);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
}

/**
 * App Routes
 */
app.get("/", (req, res) => {
    res.render("login", { showSignInButton: true });
});

// Initiates auth code grant for login
app.get("/login", (req, res) => {
    // future enabler
    if (authCodeRequest.state === APP_STATES.password_reset) {
        // if coming for password reset, set the authority to password reset
        getAuthCode(policies.authorities.resetPassword.authority, SCOPES.pbi, APP_STATES.password_reset, res);
    } else {
        // else, login as usual
        getAuthCode(policies.authorities.signUpSignIn.authority, SCOPES.pbi, APP_STATES.login, res);
    }
})


// Initiates auth code grant for web API call
app.get("/api", async (req, res) => {
    // If no accessToken in store, request authorization code to exchange for a token
    if (!app.locals.accessToken) {
        getAuthCode(policies.authorities.signUpSignIn.authority, SCOPES.resource1, APP_STATES.call_api, res);
    } else {
        // else, render the embedded page
        res.render("pbi", templateParams);
        ;
    }
});

app.get('/logout', function(req, res){
    res.redirect(process.env.destroySessionUrl);
  });

// Second leg of auth code grant
app.get("/redirect", (req, res) => {

    // determine where the request comes from
    if (req.query.state === APP_STATES.login) {

        // prepare the request for authentication
        tokenRequest.scopes = SCOPES.pbi;
        tokenRequest.code = req.query.code;

        cca.acquireTokenByCode(tokenRequest)
            .then((response) => {
                const templateParams = { showLoginButton: false, username: response.account.username, profile: false };
                res.render("pbi", templateParams);
            }).catch((error) => {
                if (req.query.error) {

                    /**
                     * When the user selects "forgot my password" on the sign-in page, B2C service will throw an error.
                     * We are to catch this error and redirect the user to login again with the resetPassword authority.
                     * For more information, visit: https://docs.microsoft.com/azure/active-directory-b2c/user-flow-overview#linking-user-flows
                     */
                    if (JSON.stringify(req.query.error_description).includes("AADB2C90118")) {
                        authCodeRequest.authority = policies.authorities.resetPassword;
                        authCodeRequest.state = APP_STATES.password_reset;
                        return res.redirect('/login');
                    }
                }
                res.status(500).send(error);
            });

    } 

    else {
        res.status(500).send("Unknown");
    }
});

app.get('/getEmbedToken', async function (req, res) {
    
    // Validate whether all the required configurations are provided in config.json
    configCheckResult = utils.validateConfig();
    
    if (configCheckResult) {
        return {
            "status": 400,
            "error": configCheckResult
        };
    }
    // Get the details like Embed URL, Access token and Expiry
    
    let result = await embedToken.getEmbedInfo();
    
    // result.status specified the statusCode that will be sent along with the result object
    res.status(result.status).send(result);
});

app.listen(SERVER_PORT, () => console.log(`Msal Node Auth Code PBI listening on port ${SERVER_PORT}!`));
