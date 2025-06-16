"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarmupLambda = void 0;
const constructs_1 = require("constructs");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_events_1 = require("aws-cdk-lib/aws-events");
const aws_events_targets_1 = require("aws-cdk-lib/aws-events-targets");
const path_1 = __importDefault(require("path"));
class WarmupLambda extends constructs_1.Construct {
    constructor(scope, id, options) {
        super(scope, id);
        const { function: func, concurrency } = options;
        const apiWarmupFunc = new aws_lambda_1.Function(this, 'warmup', {
            functionName: func.functionName + '--warmup',
            runtime: aws_lambda_1.Runtime.NODEJS_20_X,
            handler: 'index.handler',
            code: new aws_lambda_1.AssetCode(path_1.default.join(__dirname, './code/'), {
                exclude: ['node_modules', 'package.json', 'yarn.lock'],
            }),
            timeout: aws_cdk_lib_1.Duration.seconds(30),
            environment: {
                API_LAMBDA_NAME: func.functionName,
                API_WARMUP_CONCURRENCY: `${concurrency ?? 1}`,
            },
        });
        func.grantInvoke(apiWarmupFunc);
        const apiWarmupRule = new aws_events_1.Rule(this, 'warmupRule', {
            enabled: true,
            description: 'Warmup api lambda for each 5 mins',
            schedule: aws_events_1.Schedule.cron({ minute: '*/5' }),
            ruleName: `${func.functionName}-warmup-rule`,
        });
        apiWarmupRule.addTarget(new aws_events_targets_1.LambdaFunction(apiWarmupFunc, {
            retryAttempts: 0,
            event: aws_events_1.RuleTargetInput.fromObject({ Cron: { type: 'api-warmup' } }),
        }));
    }
}
exports.WarmupLambda = WarmupLambda;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2FybXVwLWxhbWJkYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndhcm11cC1sYW1iZGEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsMkNBQXNDO0FBQ3RDLHVEQUFxRTtBQUNyRSw2Q0FBc0M7QUFDdEMsdURBQXdFO0FBQ3hFLHVFQUErRDtBQUMvRCxnREFBdUI7QUFPdkIsTUFBYSxZQUFhLFNBQVEsc0JBQVM7SUFDekMsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxPQUE0QjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBRWhCLE1BQU0sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE9BQU8sQ0FBQTtRQUUvQyxNQUFNLGFBQWEsR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRTtZQUNqRCxZQUFZLEVBQUUsSUFBSSxDQUFDLFlBQVksR0FBRyxVQUFVO1lBQzVDLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsT0FBTyxFQUFFLGVBQWU7WUFDeEIsSUFBSSxFQUFFLElBQUksc0JBQVMsQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBRTtnQkFDbkQsT0FBTyxFQUFFLENBQUMsY0FBYyxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUM7YUFDdkQsQ0FBQztZQUNGLE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUM7WUFDN0IsV0FBVyxFQUFFO2dCQUNYLGVBQWUsRUFBRSxJQUFJLENBQUMsWUFBWTtnQkFDbEMsc0JBQXNCLEVBQUUsR0FBRyxXQUFXLElBQUksQ0FBQyxFQUFFO2FBQzlDO1NBQ0YsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQTtRQUUvQixNQUFNLGFBQWEsR0FBRyxJQUFJLGlCQUFJLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtZQUNqRCxPQUFPLEVBQUUsSUFBSTtZQUNiLFdBQVcsRUFBRSxtQ0FBbUM7WUFDaEQsUUFBUSxFQUFFLHFCQUFRLENBQUMsSUFBSSxDQUFDLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxDQUFDO1lBQzFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLGNBQWM7U0FDN0MsQ0FBQyxDQUFBO1FBQ0YsYUFBYSxDQUFDLFNBQVMsQ0FDckIsSUFBSSxtQ0FBYyxDQUFDLGFBQWEsRUFBRTtZQUNoQyxhQUFhLEVBQUUsQ0FBQztZQUNoQixLQUFLLEVBQUUsNEJBQWUsQ0FBQyxVQUFVLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsWUFBWSxFQUFFLEVBQUUsQ0FBQztTQUNwRSxDQUFDLENBQ0gsQ0FBQTtJQUNILENBQUM7Q0FDRjtBQW5DRCxvQ0FtQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb25zdHJ1Y3QgfSBmcm9tICdjb25zdHJ1Y3RzJ1xuaW1wb3J0IHsgQXNzZXRDb2RlLCBGdW5jdGlvbiwgUnVudGltZSB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1sYW1iZGEnXG5pbXBvcnQgeyBEdXJhdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliJ1xuaW1wb3J0IHsgUnVsZSwgU2NoZWR1bGUsIFJ1bGVUYXJnZXRJbnB1dCB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMnXG5pbXBvcnQgeyBMYW1iZGFGdW5jdGlvbiB9IGZyb20gJ2F3cy1jZGstbGliL2F3cy1ldmVudHMtdGFyZ2V0cydcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbmV4cG9ydCBpbnRlcmZhY2UgV2FybXVwTGFtYmRhT3B0aW9ucyB7XG4gIGZ1bmN0aW9uOiBGdW5jdGlvblxuICBjb25jdXJyZW5jeT86IG51bWJlclxufVxuXG5leHBvcnQgY2xhc3MgV2FybXVwTGFtYmRhIGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgb3B0aW9uczogV2FybXVwTGFtYmRhT3B0aW9ucykge1xuICAgIHN1cGVyKHNjb3BlLCBpZClcblxuICAgIGNvbnN0IHsgZnVuY3Rpb246IGZ1bmMsIGNvbmN1cnJlbmN5IH0gPSBvcHRpb25zXG5cbiAgICBjb25zdCBhcGlXYXJtdXBGdW5jID0gbmV3IEZ1bmN0aW9uKHRoaXMsICd3YXJtdXAnLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IGZ1bmMuZnVuY3Rpb25OYW1lICsgJy0td2FybXVwJyxcbiAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzIwX1gsXG4gICAgICBoYW5kbGVyOiAnaW5kZXguaGFuZGxlcicsXG4gICAgICBjb2RlOiBuZXcgQXNzZXRDb2RlKHBhdGguam9pbihfX2Rpcm5hbWUsICcuL2NvZGUvJyksIHtcbiAgICAgICAgZXhjbHVkZTogWydub2RlX21vZHVsZXMnLCAncGFja2FnZS5qc29uJywgJ3lhcm4ubG9jayddLFxuICAgICAgfSksXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwKSxcbiAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgIEFQSV9MQU1CREFfTkFNRTogZnVuYy5mdW5jdGlvbk5hbWUsXG4gICAgICAgIEFQSV9XQVJNVVBfQ09OQ1VSUkVOQ1k6IGAke2NvbmN1cnJlbmN5ID8/IDF9YCxcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIGZ1bmMuZ3JhbnRJbnZva2UoYXBpV2FybXVwRnVuYylcblxuICAgIGNvbnN0IGFwaVdhcm11cFJ1bGUgPSBuZXcgUnVsZSh0aGlzLCAnd2FybXVwUnVsZScsIHtcbiAgICAgIGVuYWJsZWQ6IHRydWUsXG4gICAgICBkZXNjcmlwdGlvbjogJ1dhcm11cCBhcGkgbGFtYmRhIGZvciBlYWNoIDUgbWlucycsXG4gICAgICBzY2hlZHVsZTogU2NoZWR1bGUuY3Jvbih7IG1pbnV0ZTogJyovNScgfSksXG4gICAgICBydWxlTmFtZTogYCR7ZnVuYy5mdW5jdGlvbk5hbWV9LXdhcm11cC1ydWxlYCxcbiAgICB9KVxuICAgIGFwaVdhcm11cFJ1bGUuYWRkVGFyZ2V0KFxuICAgICAgbmV3IExhbWJkYUZ1bmN0aW9uKGFwaVdhcm11cEZ1bmMsIHtcbiAgICAgICAgcmV0cnlBdHRlbXB0czogMCxcbiAgICAgICAgZXZlbnQ6IFJ1bGVUYXJnZXRJbnB1dC5mcm9tT2JqZWN0KHsgQ3JvbjogeyB0eXBlOiAnYXBpLXdhcm11cCcgfSB9KSxcbiAgICAgIH0pLFxuICAgIClcbiAgfVxufVxuIl19