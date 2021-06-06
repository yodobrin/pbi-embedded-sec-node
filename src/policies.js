// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------
/**
 * Enter here the user flows and custom policies for your B2C application
 * To learn more about user flows, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit: https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
 const b2cPolicies = {
    
    authorities: {
        signUpSignIn: {
            authority: "https://login.microsoftonline.com/f0e6537e-df60-485a-86a3-2148b00b65b0",
        }
        
    }
}

module.exports = b2cPolicies;