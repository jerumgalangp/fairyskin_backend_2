export interface ParameterRouteInterface {
    id?: string | string[];
    parameter_name?: string;
    parameter_type?: string;
    parameter_value?: string;
}

export interface ParameterRouteCreateInterface {
    parameter_name: string;
    parameter_type: string;
    parameter_value: string;
}

export interface ParameterRouteUpdateInterface {
    id: string;
    parameter_name?: string;
    parameter_type?: string;
    parameter_value?: string;
}

export interface ParameterRouteDeleteInterface {
    id: string;
}
