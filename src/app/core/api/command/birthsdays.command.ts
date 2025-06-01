import moment from "moment";

export class BirthsdaysCommand {
    constructor(data?: any) {
        console.log(data)
        this.id = data?.id;
        this.sort = data?.sort;
        this.createdDate = data?.createdDate;
        this.name = data?.name;
        this.dateOfBirth = data?.dateOfBirth ? moment(data?.dateOfBirth).toDate() : undefined;
        this.birthday = data?.birthday;
        this.age = data?.age;
    }

    id: string;
    sort: number;
    createdDate?: Date;
    name: string;
    dateOfBirth?: Date;
    birthday: Date;
    age: number;
}