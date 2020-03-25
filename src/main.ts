import * as core from '@actions/core'
import * as aws from 'aws-sdk'
import LAMBDA from 'aws-sdk/cl'
import * as uuid from 'node-uuid'

enum InvocationType {
  Event = "Event",
  RequestResponse = "RequestResponse",
  DryRun = "DryRun"
}

enum LogType {
  None = "None",
  Tail = "Tail"
}

async function main(): Promise<void> {
  try {

    const functionName = core.getInput('functionName');
    const invocationType = core.getInput('invocationType');
    const logType = core.getInput('logType');
    const clientContext = core.getInput('clientContext');
    const payload = core.getInput('payload');
    const qualifier = core.getInput('qualifier');
    const outfile = core.getInput('outfile');

    const params = core.getInput('params');
    const endpoint = core.getInput('endpoint');
    const accessKeyId = core.getInput('accessKeyId');
    const secretAccessKey = core.getInput('secretAccessKey');
    const sessionToken = core.getInput('sessionToken');
    const credentials = core.getInput('credentials');
    const credentialProvider = core.getInput('credentialProvider');
    const region = core.getInput('region');
    const maxRetries = parseInt(core.getInput('maxRetries'));
    const maxRedirects = parseInt(core.getInput('maxRedirects'));
    const sslEnabled = new Boolean(core.getInput('sslEnabled'));
    const paramValidation = {
      min: core.getInput('paramValidation_min'),
      max: core.getInput('paramValidation_max'),
      pattern: core.getInput('paramValidation_pattern'),
      enum: core.getInput('paramValidation_enum')
    }
    const computeChecksums = new Boolean(core.getInput('computeChecksums'));
    const convertResponseTypes = new Boolean(core.getInput('convertResponseTypes'));
    const correctClockSkew = new Boolean(core.getInput('correctClockSkew'));
    const s3ForcePathStyle = new Boolean(core.getInput('s3ForcePathStyle'));
    const s3BucketEndpoint = new Boolean(core.getInput('s3BucketEndpoint'));
    const s3DisableBodySigning = new Boolean(core.getInput('s3DisableBodySigning'));
    const s3UsEast1RegionalEndpoint = core.getInput('s3UsEast1RegionalEndpoint');
    const s3UseArnRegion = new Boolean(core.getInput('s3UseArnRegion'));
    const retryDelayOptions = {
      base: core.getInput('base'),
      customBackoff: core.getInput('customBackoff')

    }
    const httpOptions = {
      proxy: core.getInput('httpOptions_proxy'),
      agent: core.getInput('httpOptions_agent'),
      connectTimeout: core.getInput('httpOptions_connectTimeout'),
      timeout: core.getInput('httpOptions_timeout'),
      xhrAsync: core.getInput('httpOptions_xhrAsync'),
      xhrWithCredentials: core.getInput('httpOptions_xhrWithCredentials')
    }
    const apiVersion = core.getInput('apiVersion');
    const apiVersions = core.getInput('apiVersions');
    const logger = core.getInput('logger');
    const systemClockOffset = parseInt(core.getInput('systemClockOffset'));
    const signatureVersion = core.getInput('signatureVersion');
    const signatureCache = new Boolean(core.getInput('signatureCache'));
    const dynamoDbCrc32 = new Boolean(core.getInput('dynamoDbCrc32'));
    const useAccelerateEndpoint = new Boolean(core.getInput('useAccelerateEndpoint'));
    const clientSideMonitoring = new Boolean(core.getInput('clientSideMonitoring'));
    const endpointDiscoveryEnabled = new Boolean(core.getInput('endpointDiscoveryEnabled'));
    const endpointCacheSize = parseInt(core.getInput('endpointCacheSize'));
    const hostPrefixEnabled = new Boolean(core.getInput('hostPrefixEnabled'));
    const stsRegionalEndpoints = core.getInput('stsRegionalEndpoints');

    console.debug(`functionName :  ${functionName}`)
    console.debug(`invocationType :  ${invocationType}`)
    console.debug(`logType :  ${logType}`)
    console.debug(`clientContext :  ${clientContext}`)
    console.debug(`payload :  ${payload}`)
    console.debug(`qualifier :  ${qualifier}`)
    console.debug(`outfile :  ${outfile}`)

    console.debug(`params : ${params}`);
    console.debug(`endpoint : ${endpoint}`);
    console.debug(`accessKeyId : ${accessKeyId}`);
    console.debug(`secretAccessKey : ${secretAccessKey}`);
    console.debug(`sessionToken : ${sessionToken}`);
    console.debug(`credentials : ${credentials}`);
    console.debug(`credentialProvider : ${credentialProvider}`);
    console.debug(`region : ${region}`);
    console.debug(`maxRetries : ${maxRetries}`);
    console.debug(`maxRedirects : ${maxRedirects}`);
    console.debug(`sslEnabled : ${sslEnabled}`);
    console.debug(`paramValidation : ${paramValidation}`);
    console.debug(`computeChecksums : ${computeChecksums}`);
    console.debug(`convertResponseTypes : ${convertResponseTypes}`);
    console.debug(`correctClockSkew : ${correctClockSkew}`);
    console.debug(`s3ForcePathStyle : ${s3ForcePathStyle}`);
    console.debug(`s3BucketEndpoint : ${s3BucketEndpoint}`);
    console.debug(`s3DisableBodySigning : ${s3DisableBodySigning}`);
    console.debug(`s3UsEast1RegionalEndpoint : ${s3UsEast1RegionalEndpoint}`);
    console.debug(`s3UseArnRegion : ${s3UseArnRegion}`);
    console.debug(`retryDelayOptions : ${retryDelayOptions}`);
    console.debug(`httpOptions : ${httpOptions}`);
    console.debug(`apiVersion : ${apiVersion}`);
    console.debug(`apiVersions : ${apiVersions}`);
    console.debug(`logger : ${logger}`);
    console.debug(`systemClockOffset : ${systemClockOffset}`);
    console.debug(`signatureVersion : ${signatureVersion}`);
    console.debug(`signatureCache : ${signatureCache}`);
    console.debug(`dynamoDbCrc32 : ${dynamoDbCrc32}`);
    console.debug(`useAccelerateEndpoint : ${useAccelerateEndpoint}`);
    console.debug(`clientSideMonitoring : ${clientSideMonitoring}`);
    console.debug(`endpointDiscoveryEnabled : ${endpointDiscoveryEnabled}`);
    console.debug(`endpointCacheSize : ${endpointCacheSize}`);
    console.debug(`hostPrefixEnabled : ${hostPrefixEnabled}`);
    console.debug(`stsRegionalEndpoints : ${stsRegionalEndpoints}`);

    const serviceOptions = {
      params,
      endpoint,
      accessKeyId,
      secretAccessKey,
      sessionToken,
      credentials,
      credentialProvider,
      region,
      maxRetries,
      maxRedirects,
      sslEnabled,
      paramValidation,
      computeChecksums,
      convertResponseTypes,
      correctClockSkew,
      s3ForcePathStyle,
      s3BucketEndpoint,
      s3DisableBodySigning,
      s3UsEast1RegionalEndpoint,
      s3UseArnRegion,
      retryDelayOptions,
      httpOptions,
      apiVersion,
      apiVersions,
      logger,
      systemClockOffset,
      signatureVersion,
      signatureCache,
      dynamoDbCrc32,
      useAccelerateEndpoint,
      clientSideMonitoring,
      endpointDiscoveryEnabled,
      endpointCacheSize,
      hostPrefixEnabled,
      stsRegionalEndpoints
    }

      var lambda = new aws.lambda(serviceOptions)
      
    if (!(logType in LogType)) {
      throw Error("Invalid Log Type. Valid Values are None and Tail")
    }

    if (!(invocationType in InvocationType)) {
      throw Error("Invalid Invocation Type. Valid Values are Event, RequestResponse and DryRun")
    }

    var lambdaOutput = "";
    core.setOutput('lambdaOutput', JSON.stringify(lambdaOutput))
  } catch (error) {
    console.log(error)
    core.setFailed(error.message)
  }
}

main()
