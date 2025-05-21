export class PresentationCommand {
    constructor(data?: any) {
        this.father = data?.father;
        this.mother = data?.mother;
        this.children = data?.children;
    }

    father: string;
    mother: string
    children: string;
}