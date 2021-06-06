// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

// let config = require(__dirname + "/../config/config.json");
require('dotenv').config();


function getAuthHeader(accessToken) {

    // Function to append Bearer against the Access Token
    return "Bearer ".concat(accessToken);
}

function validateConfig() {

    // Validation function to check whether the Configurations are available in the config.json file or not

    let guid = require("guid");
    
    if (!process.env.authenticationMode) {
        return "AuthenticationMode is empty. Please choose MasterUser or ServicePrincipal in config.json.";
    }

    if (process.env.authenticationMode.toLowerCase() !== "masteruser" && process.env.authenticationMode.toLowerCase() !== "serviceprincipal") {
        return "AuthenticationMode is wrong. Please choose MasterUser or ServicePrincipal in config.json";
    }
    
    // config.clientId
    if (!process.env.pbi_clientId) {
        return "ClientId is empty. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in config.json.";
    }
    
    if (!guid.isGuid(process.env.pbi_clientId)) {
        return "ClientId must be a Guid object. Please register your application as Native app in https://dev.powerbi.com/apps and fill Client Id in config.json.";
    }
    
    if (!process.env.reportId) {
        return "ReportId is empty. Please select a report you own and fill its Id in config.json.";
    }
    
    if (!guid.isGuid(process.env.reportId)) {
        return "ReportId must be a Guid object. Please select a report you own and fill its Id in config.json.";
    }
    
    if (!process.env.workspaceId) {
        return "WorkspaceId is empty. Please select a group you own and fill its Id in config.json.";
    }
    
    if (!guid.isGuid(process.env.workspaceId)) {
        return "WorkspaceId must be a Guid object. Please select a workspace you own and fill its Id in config.json.";
    }
    
    if (!process.env.authorityUri) {
        return "AuthorityUri is empty. Please fill valid AuthorityUri in config.json.";
    }
    
    if (process.env.authenticationMode.toLowerCase() === "masteruser") {
        if (!process.env.pbiUsername || !process.env.pbiUsername.trim()) {
            return "PbiUsername is empty. Please fill Power BI username in config.json.";
        }
        
        if (!process.env.pbiPassword || !process.env.pbiPassword.trim()) {
            return "PbiPassword is empty. Please fill password of Power BI username in config.json.";
        }
        
    } else if (process.env.authenticationMode.toLowerCase() === "serviceprincipal") {
        if (!process.env.pbi_clientSecret || !process.env.pbi_clientSecret.trim()) {
            return "ClientSecret is empty. Please fill Power BI ServicePrincipal ClientSecret in config.json.";
        }
        
        if (!process.env.tenantId) {
            return "TenantId is empty. Please fill the TenantId in config.json.";
        }
        
        if (!guid.isGuid(process.env.tenantId)) {
            return "TenantId must be a Guid object. Please select a workspace you own and fill its Id in config.json.";
        }
    }
}

module.exports = {
    getAuthHeader: getAuthHeader,
    validateConfig: validateConfig,
}