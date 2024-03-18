import { EmpleadoSolicitud } from "./empleado_solicitud.interface";
import { SolicitudEstado } from "./solicitud.interface";

export interface SolicitudCrear{
    fecha_fin: string,
    fecha_inicio: string,
    estado: SolicitudEstado,
    justificacion: string,
    empleado: EmpleadoSolicitud,

}