import { Injectable } from "@nestjs/common";
import { APIRes } from "pinkie-api-types";
import SwearWordList from "src/assets/swearWordList";
import SwearReplyList from "src/assets/swearReplyList";
import { CheckMessageDto } from "./dto/check-message.dto";

@Injectable()
export class SwearService {
    returnSwearWordList(): string[] {
        return SwearWordList;
    }

    returnSwearReplyList(): string[] {
        return SwearReplyList;
    }

    checkSwear({ message }: CheckMessageDto): APIRes {
        const contains =
            SwearWordList.filter(word => {
                const wordExp = new RegExp(word, "gui");
                return wordExp.test(message);
            }).length > 0 || false;
        const payload = { contains };
        if (contains)
            Object.assign(payload, {
                message:
                    SwearReplyList[
                        Math.floor(Math.random() * SwearReplyList.length)
                    ],
            });
        return payload;
    }

    returnRandomSwearReply(): APIRes {
        return {
            message:
                SwearReplyList[
                    Math.floor(Math.random() * SwearReplyList.length)
                ],
        };
    }
}
