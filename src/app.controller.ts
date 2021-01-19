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
            version: "1.1.2",
            latestKey: "butter-crayfish",
            offsets: {
                m_bDormant: 0xED,
                m_bSpotted: 0x93D,
                m_dwBoneMatrix: 0x26A8,
                m_fFlags: 0x104,
                m_flFlashMaxAlpha: 0xA41C,
                m_iCrosshairId: 0xB3E4,
                m_iGlowIndex: 0xA438,
                m_iHealth: 0x100,
                m_iTeamNum: 0xF4,
                m_vecOrigin: 0x138,
                m_vecViewOffset: 0x108,
                dwClientState: 0x58EFE4,
                dwClientState_ViewAngles: 0x4D90,
                dwEntityList: 0x4DA2E74,
                dwForceAttack: 0x31D4404,
                dwForceJump: 0x524CDD4,
                dwGlowObjectManager: 0x52EB478,
                dwLocalPlayer: 0xD8B2AC,
                m_iDefaultFOV: 0x332C,
                m_iShotsFired: 0xA390,
                m_aimPunchAngle: 0x302C,
                m_clrRender: 0x70
            },
        };
    }

    @Get()
    @Redirect("/docs", 302)
    redirectToDocs(): void {}
}
