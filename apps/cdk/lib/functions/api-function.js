"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiFunction = void 0;
const path_1 = __importDefault(require("path"));
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const _function_base_1 = require("./_function-base");
const warmup_lambda_1 = require("./warmup/warmup-lambda");
class ApiFunction extends _function_base_1.BaseFunction {
    constructor(scope, id, config) {
        super(scope, id);
        this.functionId = `api`;
        this.function = new aws_lambda_1.Function(this, this.functionId, {
            description: `${config.name} API ${config.env}`,
            functionName: `${config.name}-api-${config.env}`,
            runtime: aws_lambda_1.Runtime.NODEJS_20_X,
            handler: 'main.handler',
            code: new aws_lambda_1.AssetCode(path_1.default.join(__dirname, '../../../be/dist/apps/api')),
            timeout: aws_cdk_lib_1.Duration.seconds(30),
            memorySize: 512,
            layers: [scope.layer],
            initialPolicy: [scope.storage.s3Policy],
            environment: {
                ...scope.commonEnvs,
            },
        });
        // Add warmup configuration
        new warmup_lambda_1.WarmupLambda(this, `${config.name}-api-warmup`, {
            function: this.function,
            concurrency: config.env === 'prd' ? 10 : 1,
        });
    }
}
exports.ApiFunction = ApiFunction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBpLWZ1bmN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBpLWZ1bmN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGdEQUF1QjtBQUN2Qix1REFBcUU7QUFDckUsNkNBQXNDO0FBQ3RDLHFEQUErQztBQUcvQywwREFBcUQ7QUFFckQsTUFBYSxXQUFZLFNBQVEsNkJBQVk7SUFDM0MsWUFBWSxLQUFlLEVBQUUsRUFBVSxFQUFFLE1BQWU7UUFDdEQsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVoQixJQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQTtRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUkscUJBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUNsRCxXQUFXLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxRQUFRLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDL0MsWUFBWSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQUksUUFBUSxNQUFNLENBQUMsR0FBRyxFQUFFO1lBQ2hELE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGNBQWM7WUFDdkIsSUFBSSxFQUFFLElBQUksc0JBQVMsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSwyQkFBMkIsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDN0IsVUFBVSxFQUFFLEdBQUc7WUFDZixNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3JCLGFBQWEsRUFBRSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDO1lBQ3ZDLFdBQVcsRUFBRTtnQkFDWCxHQUFHLEtBQUssQ0FBQyxVQUFVO2FBQ3BCO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsMkJBQTJCO1FBQzNCLElBQUksNEJBQVksQ0FBQyxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsSUFBSSxhQUFhLEVBQUU7WUFDbEQsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRO1lBQ3ZCLFdBQVcsRUFBRSxNQUFNLENBQUMsR0FBRyxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNDLENBQUMsQ0FBQTtJQUNKLENBQUM7Q0FDRjtBQTFCRCxrQ0EwQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJ1xuaW1wb3J0IHsgUnVudGltZSwgRnVuY3Rpb24sIEFzc2V0Q29kZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnXG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0IHsgQmFzZUZ1bmN0aW9uIH0gZnJvbSAnLi9fZnVuY3Rpb24tYmFzZSdcbmltcG9ydCB7IENka1N0YWNrIH0gZnJvbSAnLi4vY2RrLXN0YWNrJ1xuaW1wb3J0IHsgSUNvbmZpZyB9IGZyb20gJy4uLy4uL2Jpbi9jb25maWcnXG5pbXBvcnQgeyBXYXJtdXBMYW1iZGEgfSBmcm9tICcuL3dhcm11cC93YXJtdXAtbGFtYmRhJ1xuXG5leHBvcnQgY2xhc3MgQXBpRnVuY3Rpb24gZXh0ZW5kcyBCYXNlRnVuY3Rpb24ge1xuICBjb25zdHJ1Y3RvcihzY29wZTogQ2RrU3RhY2ssIGlkOiBzdHJpbmcsIGNvbmZpZzogSUNvbmZpZykge1xuICAgIHN1cGVyKHNjb3BlLCBpZClcblxuICAgIHRoaXMuZnVuY3Rpb25JZCA9IGBhcGlgXG4gICAgdGhpcy5mdW5jdGlvbiA9IG5ldyBGdW5jdGlvbih0aGlzLCB0aGlzLmZ1bmN0aW9uSWQsIHtcbiAgICAgIGRlc2NyaXB0aW9uOiBgJHtjb25maWcubmFtZX0gQVBJICR7Y29uZmlnLmVudn1gLFxuICAgICAgZnVuY3Rpb25OYW1lOiBgJHtjb25maWcubmFtZX0tYXBpLSR7Y29uZmlnLmVudn1gLFxuICAgICAgcnVudGltZTogUnVudGltZS5OT0RFSlNfMjBfWCxcbiAgICAgIGhhbmRsZXI6ICdtYWluLmhhbmRsZXInLFxuICAgICAgY29kZTogbmV3IEFzc2V0Q29kZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vYmUvZGlzdC9hcHBzL2FwaScpKSxcbiAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMzApLFxuICAgICAgbWVtb3J5U2l6ZTogNTEyLFxuICAgICAgbGF5ZXJzOiBbc2NvcGUubGF5ZXJdLFxuICAgICAgaW5pdGlhbFBvbGljeTogW3Njb3BlLnN0b3JhZ2UuczNQb2xpY3ldLFxuICAgICAgZW52aXJvbm1lbnQ6IHtcbiAgICAgICAgLi4uc2NvcGUuY29tbW9uRW52cyxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIEFkZCB3YXJtdXAgY29uZmlndXJhdGlvblxuICAgIG5ldyBXYXJtdXBMYW1iZGEodGhpcywgYCR7Y29uZmlnLm5hbWV9LWFwaS13YXJtdXBgLCB7XG4gICAgICBmdW5jdGlvbjogdGhpcy5mdW5jdGlvbixcbiAgICAgIGNvbmN1cnJlbmN5OiBjb25maWcuZW52ID09PSAncHJkJyA/IDEwIDogMSxcbiAgICB9KVxuICB9XG59XG4iXX0=