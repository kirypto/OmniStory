## Environment Files

The environment files in this directory serve as configuration for the applications. Two are needed:
- `environment.ts`: development configuration.
- `environment.production.ts`: production config, only needed when running `ng build --configuration=production`.

Below is a sample configuration that can be used as a template when creating the environment config files. 

```typescript
export const environment = {
  production: false,
};

export const ttapiConfig = {
  baseUrl: "http://localhost:5000",
};

export const auth0Config = {
    domain: "<domain>.us.auth0.com",
    clientId: "<clientId>",
};
```
