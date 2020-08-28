import { Injectable } from "@nestjs/common";
import * as figlet from "figlet";
import { APIRes } from "pinkie-api-types";
import { ConvertDto } from "./dto/convert.dto";

@Injectable()
export class AsciiService {
    convertMessage({ message }: ConvertDto): APIRes {
        return { message: figlet.textSync(message) };
    }
}
