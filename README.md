# pbi-embedded-sec-node

# Abstract
This repository, will walk you through the steps required to create a web application, exposing (or publishing) power BI reports, to mass amount of users without 'Pro' users license. This is a common use case for health organization, public transportation, finance etc. The solution outlines the architecture, the Azure assets requirment, and it will guide you, on how to secure your application. Power BI Embedded using node. This project is forked from [Samples](https://github.com/Microsoft/PowerBI-Developer-Samples), focusing on the Node flavor.

## Use Case
Your organization collected data, or is aiming to collect. You have a great reporting team, they produce amayzing reports from the collected data, these reports can help other achieve thier goals, save lives, help plan for traffic jams, or any other target. But you have only few 'Pro' licenses, and you dont aim on creating a premium account just yet. With power BI embedded, you can publish the reports to a large community. But, you dont just want anyone to access, you have restrictions requirments, have it regulation or a business decsion.


## Implementation Steps
In order to build your own application, follow these high level guidlines:
+ clone this repo to your local machine
+ Obtain required parameters for your Power BI report
+ Create Service Principal(s) one for the pbi access and another for the authorization of the WebApp
+ Allow the principal to leverage the embeded capacity
+ Deploy your application to Azure
+ Add authentication/authorization to the application
+ Add WAF
+ Invite users to your application

## Solution Architecture

![Architecture](https://user-images.githubusercontent.com/37622785/81040881-0c9c0e00-8eb5-11ea-9b48-6cae552efd74.png)

#### Power BI Embedded Capacity
You will need a dedicated compute resource to render and display your reports. A capacity is attached to a Power BI workspace and can be either a [Power BI Premium](https://docs.microsoft.com/en-us/power-bi/service-premium-what-is#dedicated-capacities) or [Embedded Analytics](https://azure.microsoft.com/en-us/services/power-bi-embedded/) Capacity. 
You can review the differences between the two in this [detailed whitepaper](https://go.microsoft.com/fwlink/?linkid=2057861).

You can plan your deployment size using the [assessment tool](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embedded-capacity-planning) and use these performance best pratices documents for tuning your deployment: [PBI reports](https://docs.microsoft.com/en-us/power-bi/guidance/power-bi-optimization), [PBI Embedded](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embedded-performance-best-practices).

#### Web App
[Web app](https://docs.microsoft.com/en-us/azure/app-service/overview), common PaaS solution, allowing developers to host thier code in a quick manner, it let the developr focus on the application, rather than anything else.
Web app can host application written in multiple languages. In this example we are using a Node based application. If this is your first time using one, We suggest you follow a [tutorial](https://docs.microsoft.com/en-us/azure/app-service/quickstart-nodejs?pivots=platform-linux) to get familar with the concepts.

__Note:__ Provided here is a `.env-template` file, that you will need to edit and enter your specific information.


##### Securing Web App
In most cases, you will need to use the user context to enable specific authorization access, either to areas in your app or to pass through the user context to the PowerBi report/dashboard. following are tow main repositories that showcase the abilities and capabilities of MSAL.
- [Main MSAL](https://github.com/AzureAD/microsoft-authentication-library-for-js)
- [StandAlon Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/b2c-auth-code)

### Active Directory setup
It is recoemnded to utilize Service Principal, as users might move from an organization, their authorization altered etc. In this repository, we cover the steps required to create and enable a service principal access to embedded capacity.
The following [guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) contains step by step instructions on how to create a service principal.

Another service principal is required to read user information from the ```graph api```. Please see this [guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal) to create one.

### Power BI - One time setup
There are two options to consume PBI embedded capacity, see [license types](https://docs.microsoft.com/en-us/power-bi/service-features-license-type) for more details.
+ Dedicated 'Pro' user
+ Service Principal - You need a user with [Power BI Admin and Power Platform Admin](https://docs.microsoft.com/en-us/power-bi/service-admin-role#assign-users-to-an-admin-role-in-the-microsoft-365-admin-center) roles in the AAD in order to allow [Service Prinicpal Embedding](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal#step-3---enable-the-power-bi-service-admin-settings).

The MasterAccount user or Service Principal do not automatically have permissions on all your PBI assets and therefore you will need to grant them access to Power BI workspaces where the reports you're going to embed reside.

#### Associate Embedded Capacity
This [document](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embed-service-principal) provide detailed instructions to the entire process, from creating the service principal to associate it to your public Power BI workspace.

Lastly, to wrap it all up - see this [tutorial](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embed-sample-for-customers#embed-content-using-the-sample-application) for associating the capacity.


### WAF setup
Follow this [quick start](https://docs.microsoft.com/en-us/azure/web-application-firewall/ag/application-gateway-web-application-firewall-portal) to deploy a WAF V2.

*__Note:__ when configuring the ```http``` setting toggle the ```Override with new host name``` to **Yes***