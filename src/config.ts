import * as dotenv from "dotenv";
dotenv.config();
export default {
    API_VERSION: "/v2",
    PORT: ((process.env.PORT as unknown) as number) || 3000,
};
