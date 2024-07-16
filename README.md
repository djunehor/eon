# Telemetry Service
### AWS architecture


                      - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
                      |                                                                                      |
                      |  Authorizer Lambda                                                                   |     
                      |      ^                                                                               |
                      |      |                                                                               |
                      |      |                                                                               |
[3rd party  vendor ] -|-> API gateway --> Telemetry-Queue --> Telemetry-Processor --> Telemetry-Store        |
                      |                          |                                                           |
                      |                          |                                                           |
                      |                          --> Telemetry-DLQ                                           |
                      |                                                                                      |
                      |                                                                                      |
                      - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

Schema for the telemetry data model is as described below:
```
{
  "version": string,
  "creationTime": number,
  "creationTimeISO": string,
  "deviceId": string,
    "temperature": {
      "celsius": number,
      "fahrenheit": number
    }
}
```

______________________
#### Useful Commands
- Configure AWS CLI: `aws configure`
- Delete cloudformation stack: `aws cloudformation delete-stack --stack-name eon-telemetry`
- Package Template: `sam package --output-template-file packaged.yaml --s3-bucket eon-telemetry --region us-east-1`
- Deploy Application: `sam deploy --template-file packaged.yaml --s3-bucket eon-telemetry --stack-name eon-telemetry --capabilities CAPABILITY_IAM --on-failure ROLLBACK --region us-east-1`
- Trigger lambda locally: `sam local invoke AuthorizerFunction --event authorizer/events/valid.json`
- Deploy Update/Create: `sam validate --lint && sam package --output-template-file packaged.yaml --s3-bucket eon-telemetry --region us-east-1 && sam deploy --template-file packaged.yaml --s3-bucket eon-telemetry --stack-name eon-telemetry --capabilities CAPABILITY_IAM --on-failure ROLLBACK --region us-east-1`
- Generate JWT token: http://jwtbuilder.jamiekurtz.com/
