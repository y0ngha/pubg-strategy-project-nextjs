import { validateEnvironmentVariables } from "./helpers/environment-variables-helper";
import { EnvironmentVariablesSchema } from "./schema/environment-variables.schema";

const env = validateEnvironmentVariables<typeof EnvironmentVariablesSchema>(EnvironmentVariablesSchema);
const isDevelopment = env.NODE_ENV === 'development';
const isProduction = env.NODE_ENV === 'production';
const isTest = env.NODE_ENV === 'test';

export {
    env, isDevelopment, isProduction, isTest
}