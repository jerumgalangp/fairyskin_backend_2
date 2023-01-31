export interface PersonnelRouteInterface {
    id?: string | string[];
    personnel_name?: string;
    contact_number?: string;
}

export interface PersonnelRouteCreateInterface {
    personnel_name: string;
    contact_number: string;
}

export interface PersonnelRouteUpdateInterface {
    id: string;
    personnel_name?: string;
    contact_number?: string;
}

export interface PersonnelRouteDeleteInterface {
    id: string;
}
