import { EmpleadoGenero } from "./empleados.interface";

export interface EmpleadoSolicitud{
    id:string,
    nombre: string,
    apellidos: string,
    genero: EmpleadoGenero,
    fecha_contratacion: string,
}