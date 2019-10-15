| [master](https://github.com/KenticoDocs/kontent-docs-samples-manager/tree/master) | [develop](https://github.com/KenticoDocs/kontent-docs-samples-manager/tree/develop) |
|:---:|:---:|
[![Build Status](https://travis-ci.com/KenticoDocs/kontent-docs-samples-manager.svg?branch=master)](https://travis-ci.com/KenticoDocs/kontent-docs-samples-manager/branches) [![codebeat badge](https://codebeat.co/badges/2e8300ad-7645-47f0-bc70-8cadccfc03f9)](https://codebeat.co/projects/github-com-kenticodocs-kontent-docs-samples-manager-master) | [![Build Status](https://travis-ci.com/KenticoDocs/kontent-docs-samples-manager.svg?branch=develop)](https://travis-ci.com/KenticoDocs/kontent-docs-samples-manager/branches) [![codebeat badge](https://codebeat.co/badges/744fc3a5-4e68-4855-be0f-1f18363aabb5)](https://codebeat.co/projects/github-com-kenticodocs-kontent-docs-samples-manager-develop) |

# Kentico Kontent Documentation - Samples Manager
Backend service for Kentico Kontent [documentation portal](https://docs.kontent.ai/), which utilizes Kentico Kontent as a source of its data.

Together with [GitHub Reader](https://github.com/KenticoDocs/kontent-docs-github-reader), this service is responsible for maintaining Kentico Kontent content items that represent code samples used in Kentico Kontent documentation portal. 
Samples Manager responds to changes in the stored code samples in [Azure Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) and then updates content items in Kentico Kontent project accordingly.

## Overview
1. This project is a JavaScript Azure Durable Functions application.
2. After the [GitHub Reader](https://github.com/KenticoDocs/kontent-docs-github-reader) saves changed code samples in the storage, Samples Manager updates content items in Kentico Kontent project using [Content Management API](https://docs.kontent.ai/reference/content-management-api-v2).
3. This service is subscribed to a _Blob Created_ event type which is fired when GitHub Sync stores code samples to the Azure Blob Storage.
4. In order to handle many code samples at once, the service is written as an [Azure Durable function](https://docs.microsoft.com/en-us/azure/azure-functions/durable/durable-functions-overview) that executes a sequence of functions in a specific order. Each of those functions will process only a specified amount of code samples.

## Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on Kentico Kontent and MS Azure

### Instructions
1. Open Visual Studio Code and install the prerequisites according to the [following steps](https://code.visualstudio.com/tutorials/functions-extension/getting-started).
2. Log in to Azure using the Azure Functions extension tab.
3. Clone the project repository and open it in Visual Studio Code.
4. Run `yarn install` in the terminal.
5. Set the required keys.
6. Deploy to Azure using Azure Functions extension tab, or run locally by pressing `Ctrl + F5` in Visual Studio Code.

#### Required Keys
* `KC.ProjectId` - Kentico Kontent project ID
* `KC.ContentManagementApiKey` - Kentico Kontent CM API key
* `KC.Step.CopywritingId` - Copywriting workflow step ID
* `KC.Step.PublishedId` - Published workflow step ID
* `KC.Step.ArchivedId` - Archived workflow step ID
* `Azure.ConnectionString` - Connection string for the Azure Storage account
* `ChunkSize` - Amount of code samples processed in a call of a single function
* `EventGrid.Notification.Key` - Key for notification eventGrid topic
* `EventGrid.Notification.Endpoint` - Url for notification eventGrid topic



## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
