import * as core from '@actions/core'
import * as aws from 'aws-sdk'
import lambda, { ClientConfiguration, InvocationRequest, InvokeAsyncResponse, InvokeAsyncRequest, InvocationResponse } from 'aws-sdk/clients/lambda'
import { ParamValidation, RetryDelayOptions, HTTPOptions, Logger} from 'aws-sdk/lib/config'
import * as httpAgent from 'http'
import * as httpsAgent from 'https'
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

    if (!(logType in LogType)) {
      throw Error("Invalid Log Type. Valid Values are None and Tail")
    }

    if (!(invocationType in InvocationType)) {
      throw Error("Invalid Invocation Type. Valid Values are Event, RequestResponse and DryRun")
    }

    const params = JSON.parse(core.getInput('params'));
    const endpoint = core.getInput('endpoint');
    const accessKeyId = core.getInput('accessKeyId');
    const secretAccessKey = core.getInput('secretAccessKey');
    const sessionToken = core.getInput('sessionToken');
    const region = core.getInput('region');
    const maxRetries = parseInt(core.getInput('maxRetries'));
    const maxRedirects = parseInt(core.getInput('maxRedirects'));
    const sslEnabled = Boolean(core.getInput('sslEnabled'));
    const paramValidation: ParamValidation = {
      min: Boolean(core.getInput('paramValidation_min')),
      max: Boolean(core.getInput('paramValidation_max')),
      pattern: Boolean(core.getInput('paramValidation_pattern')),
      enum: Boolean(core.getInput('paramValidation_enum'))
    }
    const computeChecksums = Boolean(core.getInput('computeChecksums'));
    const convertResponseTypes = Boolean(core.getInput('convertResponseTypes'));
    const correctClockSkew = Boolean(core.getInput('correctClockSkew'));
    const s3ForcePathStyle = Boolean(core.getInput('s3ForcePathStyle'));
    const s3BucketEndpoint = Boolean(core.getInput('s3BucketEndpoint'));
    const s3DisableBodySigning = Boolean(core.getInput('s3DisableBodySigning'));
    const s3UsEast1RegionalEndpoint = core.getInput('s3UsEast1RegionalEndpoint');
    const s3UseArnRegion = Boolean(core.getInput('s3UseArnRegion'));

    const retryDelayOptions: RetryDelayOptions = {
      base: parseInt(core.getInput('base'))
    }
    const agent = core.getInput('httpOptions_agent').toLowerCase() == "http.agent" ? (new httpAgent.Agent()): (new httpsAgent.Agent())
    
    
    const httpOptions: HTTPOptions = {
      proxy: core.getInput('httpOptions_proxy'),
      agent,
      connectTimeout: parseInt(core.getInput('httpOptions_connectTimeout')),
      timeout: parseInt(core.getInput('httpOptions_timeout')),
      xhrAsync: Boolean(core.getInput('httpOptions_xhrAsync')),
      xhrWithCredentials: Boolean(core.getInput('httpOptions_xhrWithCredentials'))
    }
    const apiVersion = core.getInput('apiVersion');
    const apiVersions = core.getInput('apiVersions');
    const logger: Logger = {
      write: console.log,
      log: console.log
    }
    const systemClockOffset = parseInt(core.getInput('systemClockOffset'));
    const signatureVersion = core.getInput('signatureVersion');
    const signatureCache = Boolean(core.getInput('signatureCache'));
    const dynamoDbCrc32 = Boolean(core.getInput('dynamoDbCrc32'));
    const useAccelerateEndpoint = Boolean(core.getInput('useAccelerateEndpoint'));
    const clientSideMonitoring = Boolean(core.getInput('clientSideMonitoring'));
    const endpointDiscoveryEnabled = Boolean(core.getInput('endpointDiscoveryEnabled'));
    const endpointCacheSize = parseInt(core.getInput('endpointCacheSize'));
    const hostPrefixEnabled = Boolean(core.getInput('hostPrefixEnabled'));
    
    const stsRegionalEndpoints: "legacy" | "regional" = core.getInput('stsRegionalEndpoints') == "regional" ? "regional"  : "legacy"

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

    const serviceOptions: ClientConfiguration = {
      params,
      endpoint,
      accessKeyId,
      secretAccessKey,
      sessionToken,
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
      s3UseArnRegion,
      retryDelayOptions,
      httpOptions,
      apiVersion,
      logger,
      systemClockOffset,
      signatureVersion,
      signatureCache,
      dynamoDbCrc32,
      useAccelerateEndpoint,
      endpointDiscoveryEnabled,
      endpointCacheSize,
      hostPrefixEnabled,
      stsRegionalEndpoints
    }

    const lambdaService = new lambda(serviceOptions)

    var invokeParams: InvocationRequest = {
      ClientContext: clientContext, 
      FunctionName: functionName, 
      InvocationType: invocationType, 
      LogType: logType, 
      Payload: payload, 
      Qualifier: qualifier
     };

    await lambdaService.invoke(invokeParams, function(err: aws.AWSError, data: InvocationResponse) {
      if (err) console.log(err, err.stack); // an error occurred
      else  {
        core.setOutput('lambdaOutputStatusCode', `${data.StatusCode}`)
        core.setOutput('lambdaOutputPayload', JSON.stringify(data.Payload))
        console.log(data);
      } 
    });

    var lambdaOutput = "";
    core.setOutput('lambdaOutput', JSON.stringify(lambdaOutput))
  } catch (error) {
    console.log(error)
    core.setFailed(error.message)
  }
}

main()
