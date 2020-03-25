import * as core from '@actions/core'
import * as aws from 'aws-sdk'
import lambda, {ClientConfiguration, InvocationRequest, InvocationResponse} from 'aws-sdk/clients/lambda'
import {ParamValidation, RetryDelayOptions, HTTPOptions, Logger} from 'aws-sdk/lib/config'
import * as httpAgent from 'http'
import * as httpsAgent from 'https'

enum InvocationType {
  Event = 'Event',
  RequestResponse = 'RequestResponse',
  DryRun = 'DryRun'
}

enum LogType {
  None = 'None',
  Tail = 'Tail'
}

async function main(): Promise<void> {
  try {
    const functionName = core.getInput('functionName')
    const invocationType = core.getInput('invocationType')
    const logType = core.getInput('logType')
    const clientContext = core.getInput('clientContext')
    const payload = core.getInput('payload')
    const qualifier = core.getInput('qualifier')


    if (!(logType in LogType)) {
      throw Error('Invalid Log Type. Valid Values are None and Tail')
    }

    if (!(invocationType in InvocationType)) {
      throw Error('Invalid Invocation Type. Valid Values are Event, RequestResponse and DryRun')
    }

    const endpoint = core.getInput('endpoint')
    const accessKeyId = core.getInput('accessKeyId')
    const secretAccessKey = core.getInput('secretAccessKey')
    const sessionToken = core.getInput('sessionToken')
    const region = core.getInput('region')
    const maxRetries = parseInt(core.getInput('maxRetries'))
    const maxRedirects = parseInt(core.getInput('maxRedirects'))
    const sslEnabled = Boolean(core.getInput('sslEnabled'))
    
    const retryDelayOptions: RetryDelayOptions = {
      base: parseInt(core.getInput('base'))
    }
    
    const apiVersion = core.getInput('apiVersion')
    
    const logger: Logger = {
      write: console.log,
      log: console.log
    }
    
    console.debug(`functionName :  ${functionName}`)
    console.debug(`invocationType :  ${invocationType}`)
    console.debug(`logType :  ${logType}`)
    console.debug(`clientContext :  ${clientContext}`)
    console.debug(`payload :  ${payload}`)
    console.debug(`qualifier :  ${qualifier}`)
    
    console.debug(`endpoint : ${endpoint}`)
    console.debug(`accessKeyId : ${accessKeyId}`)
    console.debug(`secretAccessKey : ${secretAccessKey}`)
    console.debug(`sessionToken : ${sessionToken}`)

    console.debug(`region : ${region}`)
    console.debug(`maxRetries : ${maxRetries}`)
    console.debug(`maxRedirects : ${maxRedirects}`)
    console.debug(`sslEnabled : ${sslEnabled}`)
    
    console.debug(`retryDelayOptions : ${retryDelayOptions}`)
    
    console.debug(`apiVersion : ${apiVersion}`)

    const serviceOptions: ClientConfiguration = {
      endpoint,
      accessKeyId,
      secretAccessKey,
      sessionToken,
      region,
      maxRetries,
      maxRedirects,
      sslEnabled,
      retryDelayOptions,
      apiVersion,
      logger
    }

    const lambdaService = new lambda(serviceOptions)

    const invokeParams: InvocationRequest = {
      ClientContext: clientContext,
      FunctionName: functionName,
      InvocationType: invocationType,
      LogType: logType,
      Payload: payload,
      Qualifier: qualifier
    }

    lambdaService.invoke(invokeParams, function(err: aws.AWSError, data: InvocationResponse) {
      if (err) console.log(err, err.stack)
      // an error occurred
      else {
        core.setOutput('lambdaOutputStatusCode', `${data.StatusCode}`)
        core.setOutput('lambdaOutputExecutedVersion', `${data.ExecutedVersion}`)
        core.setOutput('lambdaOutputFunctionError', `${data.FunctionError}`)
        core.setOutput('lambdaOutputLogResult', `${data.LogResult}`)
        core.setOutput('lambdaOutputPayload', `${data.Payload}`)
        console.log(data)
      }
    })
  } catch (error) {
    console.log(error)
    core.setFailed(error.message)
  }
}

main()
