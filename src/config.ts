import { CONFIG } from "pinkie-api-types";
import * as dotenv from "dotenv";
dotenv.config();
const Config: CONFIG = {
    API_VERSION: "/v2",
    PORT: ((process.env.PORT as unknown) as number) || 3000
}
export default Config;
