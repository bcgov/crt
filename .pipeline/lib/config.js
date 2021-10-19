"use strict";
const options = require("@bcgov/pipeline-cli").Util.parseArguments();

const changeId = options.pr; //aka pull-request
const version = "1.0.0";
const name = "crt";

Object.assign(options.git, { owner: "ychung-mot", repository: "crt" });
const phases = {
  build: {
    namespace: "2d982c-tools",
    name: `${name}`,
    phase: "build",
    changeId: changeId,
    suffix: `-build-${changeId}`,
    instance: `${name}-build-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `build-${version}-${changeId}`,
    transient: true,
  },
  dev: {
    namespace: "2d982c-dev",
    name: `${name}`,
    phase: "dev",
    changeId: changeId,
    suffix: `-dev-${changeId}`,
    instance: `${name}-dev-${changeId}`,
    version: `${version}-${changeId}`,
    tag: `dev-${version}-${changeId}`,
    host: `crt-2d982c-dev.apps.silver.devops.gov.bc.ca`,
    dwpbi_url: "https://dev-dwpbi.th.gov.bc.ca/reports/browse/CRT",
    url_prefix: "dev-",
    dotnet_env: "Development",
    transient: true,
    twm_cpu: "100m",
    twm_memory: "100Mi",
    api_cpu: "200m",
    api_memory: "300Mi",
    client_cpu: "100m",
    client_memory: "100Mi",
  },
  test: {
    namespace: "2d982c-test",
    name: `${name}`,
    phase: "test",
    changeId: changeId,
    suffix: `-test`,
    instance: `${name}-test`,
    version: `${version}`,
    tag: `test-${version}`,
    host: `crt-2d982c-test.apps.silver.devops.gov.bc.ca`,
    dwpbi_url: "https://tst-dwpbi.th.gov.bc.ca/reports/browse/CRT",
    url_prefix: "tst-",
    dotnet_env: "Staging",
    twm_cpu: "100m",
    twm_memory: "100Mi",
    api_cpu: "200m",
    api_memory: "300Mi",
    client_cpu: "100m",
    client_memory: "100Mi",
  },
  uat: {
    namespace: "2d982c-test",
    name: `${name}`,
    phase: "uat",
    changeId: changeId,
    suffix: `-uat`,
    instance: `${name}-uat`,
    version: `${version}`,
    tag: `uat-${version}`,
    host: `crt-2d982c-uat.apps.silver.devops.gov.bc.ca`,
    dwpbi_url: "https://uat-dwpbi.th.gov.bc.ca/reports/browse/CRT",
    url_prefix: "uat-",
    dotnet_env: "UAT",
    twm_cpu: "100m",
    twm_memory: "100Mi",
    api_cpu: "200m",
    api_memory: "300Mi",
    client_cpu: "100m",
    client_memory: "100Mi",
  },
  prod: {
    namespace: "2d982c-prod",
    name: `${name}`,
    phase: "prod",
    changeId: changeId,
    suffix: `-prod`,
    instance: `${name}-prod`,
    version: `${version}`,
    tag: `prod-${version}`,
    host: `crt-2d982c-prod.apps.silver.devops.gov.bc.ca`,
    dwpbi_url: "https://dwpbi.th.gov.bc.ca/reports/browse/CRT",
    url_prefix: "",
    dotnet_env: "Production",
    twm_cpu: "100m",
    twm_memory: "100Mi",
    api_cpu: "200m",
    api_memory: "600Mi",
    client_cpu: "100m",
    client_memory: "300Mi",
  },
};

// This callback forces the node process to exit as failure.
process.on("unhandledRejection", (reason) => {
  console.log(reason);
  process.exit(1);
});

module.exports = exports = { phases, options };
