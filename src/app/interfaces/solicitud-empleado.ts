export interface SolicitudEmpleado{
    id?: number;
    fecha_inicio: string;
    fecha_fin: string;
    estado:SolicitudEstado,
    fecha_creacion: string;
    justificacion: string;
    aprobada_por?: string;
    denegada_por?:string;
}

export enum SolicitudEstado{
    APROBADO = 'ACEPTADO',
    RECHAZADO = 'RECHAZADO',
    PENDIENTE = 'PENDIENTE',
}