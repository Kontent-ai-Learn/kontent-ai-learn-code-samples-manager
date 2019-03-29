| [master](https://github.com/Kentico/kentico-cloud-docs-samples-manager/tree/master) | [develop](https://github.com/Kentico/kentico-cloud-docs-samples-manager/tree/develop) |
|:---:|:---:|
|[![Build Status](https://travis-ci.com/Kentico/kentico-cloud-docs-samples-manager.svg?branch=master)](https://travis-ci.com/Kentico/kentico-cloud-docs-samples-manager/branches) [![codebeat badge](https://codebeat.co/badges/e04903e2-4820-45e4-9dce-8b612775083b)](https://codebeat.co/projects/github-com-kentico-kentico-cloud-docs-samples-manager-master) | [![Build Status](https://travis-ci.com/Kentico/kentico-cloud-docs-samples-manager.svg?branch=develop)](https://travis-ci.com/Kentico/kentico-cloud-docs-samples-manager/branches) [![codebeat badge](https://codebeat.co/badges/1c23bd38-7107-494e-9db1-e447c774e655)](https://codebeat.co/projects/github-com-kentico-kentico-cloud-docs-samples-manager-develop) |

# Kentico Cloud Documentation - Samples Manager
Backend service for Kentico Cloud documentation portal, which utilizes [Kentico Cloud](https://app.kenticocloud.com/) as a source of its content.

This service is subscribed to an [Event Grid Topic](https://azure.microsoft.com/en-us/services/event-grid/), where it receives events from [Github Sync](https://github.com/Kentico/kentico-cloud-docs-github-sync). It reads code samples that are stored locally in a [Blob Storage](https://azure.microsoft.com/en-us/services/storage/blobs/) and then it uploads them to Kentico Cloud project.

## Overview
1. This project is a JavaScript Azure Functions application.
2. ...

## Setup

### Prerequisites
1. Node (+yarn) installed
2. Visual Studio Code installed
3. Subscriptions on Kentico Cloud

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

## Testing
* Run `yarn run test` in the terminal.

## How To Contribute
Feel free to open a new issue where you describe your proposed changes, or even create a new pull request from your branch with proposed changes.

## Licence
All the source codes are published under MIT licence.
