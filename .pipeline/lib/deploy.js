"use strict";
const { OpenShiftClientX } = require("@bcgov/pipeline-cli");
const path = require("path");

const util = require("./utils");

module.exports = (settings) => {
  const phases = settings.phases;
  const options = settings.options;
  const phase = options.env;
  const changeId = phases[phase].changeId;
  const oc = new OpenShiftClientX(
    Object.assign({ namespace: phases[phase].namespace }, options)
  );
  const templatesLocalBaseUrl = oc.toFileUrl(
    path.resolve(__dirname, "../../openshift")
  );
  var objects = [];
  const logDbSecret = util.getSecret(
    oc,
    phases[phase].namespace,
    `${phases[phase].name}-logdb${phases[phase].suffix}`
  );

  // The deployment of your cool app goes here ▼▼▼
  objects.push(
    ...oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/twm-deploy-config.yaml`,
      {
        param: {
          NAME: `${phases[phase].name}-twm`,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          ENV: phases[phase].phase,
          HOST: phases[phase].host,
          CPU: phases[phase].twm_cpu,
          MEMORY: phases[phase].twm_memory,
          NAMESPACE: phases[phase].namespace,
        },
      }
    )
  );

  objects.push(
    ...oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/client-deploy-config.yaml`,
      {
        param: {
          NAME: `${phases[phase].name}-client`,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          ENV: phases[phase].phase,
          HOST: phases[phase].host,
          REACT_APP_DWPBI_URL: phases[phase].dwpbi_url,
          CPU: phases[phase].client_cpu,
          MEMORY: phases[phase].client_memory,
          NAMESPACE: phases[phase].namespace,
        },
      }
    )
  );

  if (!logDbSecret) {
    console.log("Adding logDb postgresql secret");

    objects.push(
      ...oc.processDeploymentTemplate(
        `${templatesLocalBaseUrl}/secrets/logdb-postgresql-secrets.yaml`,
        {
          param: {
            NAME: `${phases[phase].name}-logdb`,
            SUFFIX: phases[phase].suffix,
          },
        }
      )
    );
  }

  objects.push(
    ...oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/postgresql-deploy-config.yaml`,
      {
        param: {
          NAME: `${phases[phase].name}-logdb`,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          ENV: phases[phase].phase,
        },
      }
    )
  );

  objects.push(
    ...oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/configmaps/api-appsettings.yaml`,
      {
        param: {
          ENV: phases[phase].phase,
        },
      }
    )
  );

  objects.push(
    ...oc.processDeploymentTemplate(
      `${templatesLocalBaseUrl}/api-deploy-config.yaml`,
      {
        param: {
          NAME: `${phases[phase].name}-api`,
          LOGDB_NAME: `${phases[phase].name}-logdb`,
          SUFFIX: phases[phase].suffix,
          VERSION: phases[phase].tag,
          HOST: phases[phase].host,
          ENV: phases[phase].phase,
          ASPNETCORE_ENVIRONMENT: phases[phase].dotnet_env,
          CPU: phases[phase].api_cpu,
          MEMORY: phases[phase].api_memory,
          NAMESPACE: phases[phase].namespace,
        },
      }
    )
  );

  oc.applyRecommendedLabels(
    objects,
    phases[phase].name,
    phase,
    `${changeId}`,
    phases[phase].instance
  );
  oc.importImageStreams(
    objects,
    phases[phase].tag,
    phases.build.namespace,
    phases.build.tag
  );
  oc.applyAndDeploy(objects, phases[phase].instance);
};
