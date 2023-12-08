import * as cdk from "aws-cdk-lib";
import { SiteBackendStack } from "./site-backend-stack";

const app = new cdk.App();
new SiteBackendStack(app, "SiteBackendStack");
