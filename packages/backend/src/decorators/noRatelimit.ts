import { SetMetadata } from "@nestjs/common";

export const NoRatelimit = () => SetMetadata("noRateLimit", true);
