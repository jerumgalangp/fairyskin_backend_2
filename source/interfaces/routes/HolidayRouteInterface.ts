export interface HolidayRouteInterface {
    id?: string | string[];
    holiday_name?: string;
    holiday_date?: string;
}

export interface HolidayRouteCreateInterface {
    holiday_name: string;
    holiday_date: string;
}

export interface HolidayRouteUpdateInterface {
    id: string;
    holiday_name?: string;
    holiday_date?: string;
}

export interface HolidayRouteDeleteInterface {
    id: string;
}
