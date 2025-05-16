export class PersonCommand {
    constructor(data?: any) {
        this.name = data?.name;
        this.invitedBy = data?.invitedBy;
        this.church = data?.church || new ChurchCommand();
        this.birthday = new BirthdayCommand(data?.birthday);
    }

    name: string;
    invitedBy: string;
    church: ChurchCommand;
    birthday: BirthdayCommand;
}

export class ChurchCommand {
    constructor(data?: any) {
        this.attend = data?.attend;
        this.sector = data?.sector;
        this.shepherd = data?.shepherd;
        this.nameSector = data?.nameSector;
        this.name = data?.name;
    }

    attend: boolean;
    sector: boolean;
    shepherd: string;
    nameSector: string;
    name: string;
}

export class BirthdayCommand {
    constructor(data?: any) {
        this.type = data?.type;
        this.age = data?.age;
    }

    type: string;
    age: string;
}