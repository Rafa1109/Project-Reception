import moment from "moment";

export class EventoCommand {
    constructor(data?: any) {
        this.id = data?.id;
        this.sort = data?.sort;
        this.eventName = data?.eventName;
        this.departament = data?.departament;
        this.departamentName = data?.departamentName;
        this.eventDate = data?.eventDate ? moment(data?.eventDate).toDate() : undefined;
    }

    id: string;
    sort: number;
    eventName: string;
    departament: number;
    departamentName: string;
    eventDate?: Date;
}