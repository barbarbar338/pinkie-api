declare module "pinkie-api-types" {
    export interface APIRes {
        message?: string;
        [property: string]: unknown;
    }
}
