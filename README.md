| [master](https://github.com/Kentico/kentico-cloud-docs-samples-manager/tree/master) | [develop](https://github.com/Kentico/kentico-cloud-docs-samples-manager/tree/develop) |
|:---:|:---:|
|[![Build Status](https://travis-ci.com/Kentico/kentico-cloud-docs-samples-manager.svg?branch=master)](https://travis-ci.com/Kentico/kentico-cloud-docs-samples-manager/branches) [![codebeat badge](https://codebeat.co/badges/e04903e2-4820-45e4-9dce-8b612775083b)](https://codebeat.co/projects/github-com-kentico-kentico-cloud-docs-samples-manager-master) | [![Build Status](https://travis-ci.com/Kentico/kentico-cloud-docs-samples-manager.svg?branch=develop)](https://travis-ci.com/Kentico/kentico-cloud-docs-samples-manager/branches) [![codebeat badge](https://codebeat.co/badges/1c23bd38-7107-494e-9db1-e447c774e655)](https://codebeat.co/projects/github-com-kentico-kentico-cloud-docs-samples-manager-develop) |

# Kentico Cloud Documentation - Samples Manager
Backend service for Kentico Cloud [documentation portal](https://docs.kenticocloud.com/), which utilizes Kentico Cloud as a source of its content.

Together with [GitHub Sync](https://github.com/Kentico/kentico-cloud-docs-github-sync), this service is responsible for maintaining Kentico Cloud content items that represent code samples used in Kentico Cloud documentation portal. 
Samples Manager responds to changes in the stored code samples in [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) and then updates content items in Kentico Cloud project accordingly.

## Overview
1. This project is a JavaScript Azure Durable Functions application.
2. After the [GitHub Sync](https://github.com/Kentico/kentico-cloud-docs-github-sync) saves changed code samples in the storage, Samples Manager updates content items in Kentico Cloud project using [Content Management API](https://developer.kenticocloud.com/v1/reference#content-management-api-v2).
3. This service is subscribed to a _Blob Created_ event type which is fired when GitHub Sync stores code samples to the Azure Blob Storage.
4. In order to handle many code samples at once, the service is written as an [Azure Durable function](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview) that executes a sequence of functions in a specific order. Each of those functions will process only a specified amount of code samples.

## Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on Kentico Cloud and MS Azure

### Instructions
1. Open Visual Studio Code and install the prerequisites according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to Azure using the Azure Functions extension tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required keys.
6. Deploy to Azure using Azure Functions extension tab, or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys
* `KC.ProjectId` - Kentico Cloud project ID
* `KC.ContentManagementApiKey` - Kentico Cloud Content Management API key
* `KC.Step.CopywritingId` - Copywriting workflow step ID
* `KC.Step.PublishedId` - Published workflow step ID
* `KC.Step.ArchivedId` - Archived workflow step ID
* `Azure.ConnectionString` - Connection string for the Azure Storage account
* `ChunkSize` - Amount of code samples processed in a call of a single function

## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
