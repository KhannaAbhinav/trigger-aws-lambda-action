# Trigger AWS Lambda

## Description

This action invokes AWS Lambda from github. you can use it as a scheduled job or on git triggers. 

## Inputs


### endpoint

#### Description
The endpoint URI to send requests to. The Default endpoint is built from the configured region. The endpoint should be a string like 'https://{service}.{region}.amazonaws.com'.

#### Required
False

#### Default
Null


### accessKeyId

#### Description
your AWS access key ID.

#### Required
False

#### Default
Null


### secretAccessKey 
Description your AWS secret access key.

#### Required
False

#### Default
Null


### sessionToken
Description the optional AWS session token to sign requests with.

#### Required
False

#### Default
Null


### region
Description  the region to send service requests to. See AWS.Lambda.region for more information.

#### Required
False

#### Default
Null


### maxRetries
Description the maximum amount of retries to attempt with a request. See AWS.Lambda.maxRetries for more information.

#### Required
False

#### Default
Null


### maxRedirects
Description  the maximum amount of redirects to follow with a request. See AWS.Lambda.maxRedirects for more information.

#### Required
False

#### Default
Null


### sslEnabled
Description whether to enable SSL for requests.

#### Required
False

#### Default
Null


### functionName

#### Description
The name of the Lambda function, version, or alias.

#### Required
True


### invocationType

#### Description
RequestResponse (Default) - Invoke the function synchronously. Keep the connection open until the function returns a response or times out. The API response includes the function response and additional data.

Event - Invoke the function asynchronously. Send events that fail multiple times to the function's dead-letter queue (if it's configured). The API response only includes a status code.

DryRun - Validate parameter values and verify that the user or role has permission to invoke the function.

Possible values include

- "Event"
- "RequestResponse"
- "DryRun"

#### Required
False

#### Default
"RequestResponse"

### logType

#### Description 
Set to Tail to include the execution log in the response.

Possible values include
- "None"
- "Tail"

#### Required
False

#### Default
"None"


### clientContext

#### Description
Up to 3583 bytes of base64-encoded data about the invoking client to pass to the function in the context object.

#### Required
False

#### Default
Null


### payload

#### Description
The JSON that you want to provide to your Lambda function as input

#### Required
False

#### Default
Null


### qualifier

#### Description
Specify a version or alias to invoke a published version of the function.

#### Required
False

#### Default
Null


## Outputs


### lambdaOutputStatusCode

#### Description
The HTTP status code is in the 200 range for a successful request. For the RequestResponse invocation type, this status code is 200. For the Event invocation type, this status code is 202. For the DryRun invocation type, the status code is 204.


### lambdaOutputExecutedVersion

#### Description
The version of the function that executed. When you invoke a function with an alias, this indicates which version the alias resolved to.


### lambdaOutputFunctionError

#### Description
If present, indicates that an error occurred during function execution. Details about the error are included in the response payload.


### lambdaOutputLogResult

#### Description
The last 4 KB of the execution log, which is base64 encoded.


### lambdaOutputPayload

#### Description
The response from the function, or an error object.


All descriptions are copied from AWS Reference Guide.
