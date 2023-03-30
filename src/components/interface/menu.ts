export interface menuFormat {
    path: string,
    label: string,
    icon?: string,
    meta?: {},
    children?: menuFormat[],
}
