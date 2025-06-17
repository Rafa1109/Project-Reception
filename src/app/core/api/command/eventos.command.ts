import moment from "moment";

export class EventoCommand {
    constructor(data?: any) {
        this.id = data?.id;
        this.sort = data?.sort;
        this.eventName = data?.eventName;
        this.department = data?.departament;
        this.departmentName = data?.departmentName;
        this.eventDate = moment(data?.eventDate).toDate();
    }

    id: string;
    sort: number;
    eventName: string;
    department: number;
    departmentName: string;
    eventDate?: Date;
}