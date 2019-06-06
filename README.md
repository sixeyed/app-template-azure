# app-template-azure

Docker Application Template example, spinning up a Cosmos DB database in Azure, and connecting a local Node JS app container.

## Setup

Pull the scaffolding images:

```
docker-compose pull
```

Copy `library.yaml` to somewhere useful:

```
cp library.yaml /
```

Update your App Template config to include the new library. This example includes the demo library and the main Docker library:

```
apiVersion: v1alpha1
disableFeedback: false
kind: Preferences
repositories:
- name: azure-demo
  url: file:///library.yaml
- name: library
  url: https://docker-application-template.s3.amazonaws.com/production/v0.1.1/library.yaml
```

> The config file is in '~/.docker/application-template/preferences.yaml

## Usage

TODO