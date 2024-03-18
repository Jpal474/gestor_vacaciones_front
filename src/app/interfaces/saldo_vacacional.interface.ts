import { EmpleadoSolicitud } from "./empleado_solicitud.interface";
import { Empleado } from "./empleados.interface";

export interface SaldoVacacional{
    id?: number;
    año: number;
    dias_disponibles: number;
    dias_tomados:number;
    empleado:EmpleadoSolicitud
}
