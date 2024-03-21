export const environment = {
  production: true,
  staging: false,
  local:false,
  nimctest: false,
  keycloakConfig: {
    clientId: 'resw-frontend',
    realm: 'resw',
    url: 'https://res.nimc.gov.ng/auth'
  },
  apiBaseUrl: '/resw-api',
  siteUrl: 'https://res.nimc.gov.ng/auth',
  fingerServiceBaseUrl: 'http://localhost:8094',
  sessionTimeout: 1440,
  reportApiUrl: '/report-api',
  adultAge: 16,
  maxFileSizeInMb: 3,
  maxNumberOfDocuments: 3,
  pluginCheck: 'DEVICE_PLUGIN_PRESENT',
  pluginDownloadUrl: 'https://drive.google.com/uc?export=download&id=1hq5gQJQGeGdj7S9LR_FYfkXemd_N4bJk',
};
