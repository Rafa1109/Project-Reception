import { PersonCommand } from "./person.command";
import { PrayerCommand } from "./prayer.command";
import { PresentationCommand } from "./presentation.command";
import moment from "moment";
import { ENUMS } from "src/app/core/enum";

export class AvisoCommand {
    constructor(data?: any) {
        this.guestType = data?.guestType;
        this.sort = data?.sort;
        this.date = data?.date ?? new Date();
        this.person = new PersonCommand(data?.person) || null;
        this.prayer = new PrayerCommand(data?.prayer) || null;
        this.presentation = new PresentationCommand(data?.presentation) || null;
        this.message = data?.message
        this.id = data?.id ?? null;
        this.createdDate = data?.createdDate ? moment(data?.createdDate).format("DD/MM/YYYY") : undefined;
        this.createdAt = data?.createdDate ? moment(data?.createdDate).format("DD/MM/YYYY HH:mm:ss") : undefined;
        this.announced = data?.announced;
        this.guestTypeDesc = this.tratarAvisoCommand(data?.guestType);
        this.class = this.tratarClassAvisoCommand(data?.guestType);
    }

    guestType: number;
    sort: number;
    guestTypeDesc?: string;
    date: Date;
    person: PersonCommand;
    prayer: PrayerCommand;
    presentation: PresentationCommand;
    message: string;
    id: string;
    createdDate?: string;
    createdAt?: string;
    announced: boolean;
    class?: string;

    tratarAvisoCommand = (guestType: number) => {
        switch (guestType) {
            case ENUMS.VISITANTE:
                return "VISITANTE";
            case ENUMS.APRESENTACAO:
                return "APRESENTAÇÃO";
            case ENUMS.AVISO_RECADO:
                return "AVISO / RECADO";
            case ENUMS.ANIVERSARIO:
                return "ANIVERSÁRIO DE VIDA";
            case ENUMS.ANIVERSARIO_CASAMENTO:
                return "ANIVERSÁRIO DE CASAMENTO";
            case ENUMS.ORACAO:
                return "ORAÇÃO";
            default:
                return;
        }
    }

    tratarClassAvisoCommand = (guestType: number) => {
        switch (guestType) {
            case ENUMS.VISITANTE:
                return "visit";
            case ENUMS.AVISO_RECADO:
                return "message";
            case ENUMS.ANIVERSARIO:
                return "birthday";
            case ENUMS.ANIVERSARIO_CASAMENTO:
                return "birthday_wedding";
            case ENUMS.ORACAO:
                return "prayer";
            default:
                return;
        }
    }
}