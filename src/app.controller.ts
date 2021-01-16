import { Controller, Get, Redirect } from "@nestjs/common";
import { APIRes } from "pinkie-api-types";

@Controller()
export class AppController {
    @Get("ping")
    replyPing(): APIRes {
        return {
            message: "Pong!",
        };
    }

    @Get("offsets")
    getOffsets(): APIRes {
        return {
            version: "1.1.1",
            latestKey: "squishy-rock",
            offsets: {
                m_bDormant: 0xed,
                m_bSpotted: 0x93d,
                m_dwBoneMatrix: 0x26a8,
                m_fFlags: 0x104,
                m_flFlashMaxAlpha: 0xa41c,
                m_iCrosshairId: 0xb3e4,
                m_iGlowIndex: 0xa438,
                m_iHealth: 0x100,
                m_iTeamNum: 0xf4,
                m_vecOrigin: 0x138,
                m_vecViewOffset: 0x108,
                dwClientState: 0x58efe4,
                dwClientState_ViewAngles: 0x4d90,
                dwEntityList: 0x4da2e74,
                dwForceAttack: 0x31d4404,
                dwForceJump: 0x524cdd4,
                dwGlowObjectManager: 0x52eb478,
                dwLocalPlayer: 0xd8b2ac,
                m_iFOV: 0x31E4,
                m_iShotsFired: 0xA390,
                m_aimPunchAngle: 0x302C,
            },
        };
    }

    @Get()
    @Redirect("/docs", 302)
    redirectToDocs(): void {}
}
