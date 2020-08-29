declare module "pinkie-api-types" {
    export interface APIRes {
        message?: string;
        [property: string]: unknown;
    }
    export interface CONFIG {
        API_VERSION: string;
        PORT: number;
    }
}
