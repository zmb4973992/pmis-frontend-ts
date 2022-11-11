export interface menu {
    path: string,
    label: string,
    icon?:string,
    meta?: {},
    children?: menu[],
}
