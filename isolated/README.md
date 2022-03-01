# Using PowerBI embedded in a secured environments

## Disclaimer

“FastTrack for Azure" are “Professional Services” provided free of charge subject to the “Professional Services Terms” in the Online Services Terms and Online Services Data Protection Addendum.
This document is provided “AS-IS,” WITHOUT WARRANTY OF ANY KIND. Microsoft disclaims all express, implied or statutory warranties, including warranties of quality, title, non-infringement, merchantability and fitness for a particular purpose.

## What are secured environments?

B2B ISVs will deal primarily with customer's data. Assuming customers consider this data to be confidential, therefore ISVs are using dedicated virtual network to restrict access to their data and other compute and storage resources.

Here is a common network diagram:

![image](https://user-images.githubusercontent.com/37622785/155298297-f8a5a808-57d4-4daf-8c3c-65bfb86a5be3.png)

PowerBI embedded will be able to access data using a [Data Gateway](https://docs.microsoft.com/en-us/data-integration/gateway/service-gateway-communication#ports).

[Sample Architecture](https://docs.microsoft.com/en-us/azure/architecture/example-scenario/data/data-analysis-regulated-industries)

_Note:_ {to-be-edited} there is a repo with deployment scripts aligned with the above architecture sample, however it uses PBI Premium and the intention of this sample is leveraging PBI embedded (for customers)

## User Story  - As a B2B ISV DevOps

I want to have a provisioning mechanism for solutions deployed on our subscription or on customers' subscriptions.

I want to be able and deploy or provision required services and platform using industry standard tools, so I can create repeatable easy to maintain environments.

I want to be able and create (or provision) our secured solution in a customer subscriptions. I want to tbe able and parameterize the deployment.

## User Story  - As a B2B ISV Data Engineer

I want to be able and access the secured data elements from my working environment, so that I can explore it, clean it or perform specific transformation to the data.

## User Story  - As a B2B ISV Security Officer

I want to be able and provision all required resources in the most secured way, so that access to resources is restricted and controlled.

For my SaaS deployment, I want to be able and authorize access to the data and reports based on my customer subscription ensuring each customer can access only to his specific reports & dashboards.

The organization preference is to use private end-points when available.

## User Story  - As a B2B ISV Chief Operation Officer

I want for both my SaaS customers and dedicated solution customers would be able to restrict access to data, resources and reports, specificity I want my customers to be able and authorize data and content based on roles.

This repository, will walk you through the steps required to create a web application, exposing (or publishing) power BI reports, to mass amount of users without 'Pro' users license. This is a common use case for health organization, public transportation, finance etc. The solution outlines the architecture, the Azure assets requirement, and it will guide you, on how to secure your application. Power BI Embedded using node. This project is forked from [Samples](https://github.com/Microsoft/PowerBI-Developer-Samples), focusing on the Node flavor.

## User Story - As a B2B Customer

I want to be able and navigate to my ISV provider URL, authenticate and then be able to see my relevant reports or dashboards, so that I can leverage the information.

I want to be able and use my organization identity management system, so that my organization will continue to control my identity.

## Potential Use Case

Your organization collected data, or is aiming to collect. You have a great reporting team, they produce amazing reports from the collected data, these reports can help others achieve their goals, save lives, help plan for traffic jams, find the perfect price or any other target. With power BI embedded, you can publish the reports to a large community. But, you don't just want anyone to access, you have restrictions requirements, have it regulation or a business decision.

### Authenticate and Authorize users

As B2B ISV provider, I want to collaborate with my customer employees, allow them to register to my service, and maintain minimal operational aspects for them.

Using [Azure B2B Collaboration](https://docs.microsoft.com/en-us/azure/active-directory/external-identities/what-is-b2b) would be the best approach.
There are few onboarding process options:

- An invitation and redemption process lets partners use their own credentials or
- Self-service sign-up user flows to let external users sign up for apps or resources themselves

Once they complete one of the on boarding procedures, they have an entity created in the ISV AAD typically given a user type of "guest" and can be identified by the #EXT# extension in their user principal name. This entity can be associated to groups or roles, that once logged in, you can obtain it from the jwt.

To learn more on B2B Collaboration, here are few helpful documents:

- [External Identities in Azure Active Directory | Microsoft Docs](https://docs.microsoft.com/en-us/azure/active-directory/external-identities/external-identities-overview)
- [B2B collaboration overview - Azure AD | Microsoft Docs](https://docs.microsoft.com/en-us/azure/active-directory/external-identities/what-is-b2b)
- [Build apps that sign in Azure AD users - Microsoft identity platform | Microsoft Docs](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-convert-app-to-be-multi-tenant)
- [Security recommendations - Azure App Service | Microsoft Docs](https://docs.microsoft.com/en-us/azure/app-service/security-recommendations)
- [Authentication and authorization - Azure App Service | Microsoft Docs](https://docs.microsoft.com/en-us/azure/app-service/overview-authentication-authorization)
- [Grant B2B users access to your on-premises apps - Azure AD | Microsoft Docs](https://docs.microsoft.com/en-us/azure/active-directory/external-identities/hybrid-cloud-to-on-premises)
- [Azure/active-directory-dotnet-graphapi-b2bportal-web | GitHub](https://github.com/Azure/active-directory-dotnet-graphapi-b2bportal-web)
- [Using External Identities with Azure AD and SAML for B2B Apps | YouTube](https://www.youtube.com/watch?v=7waiCeg8AZ4)

### Getting an embedded token

Here is a diagram, showing how an embedded token is provided.
![image](https://user-images.githubusercontent.com/37622785/155952337-8c02ccf1-e783-4692-a034-57ac4cb7c8bb.png)
