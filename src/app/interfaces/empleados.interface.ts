import { Departamento } from "./departamento.interface";
import { SaldoVacacional } from "./saldo_vacacional.interface";
import { Usuario } from "./usuario.interface";

export interface Empleado{
    id?:string;
    nombre: string,
    apellidos: string,
    genero: EmpleadoGenero;
    fecha_contratacion: string,
    usuario: Usuario,
    departamento: Departamento,
    estado?:EmpleadoEstado,
    saldo_vacacional?:SaldoVacacional[];
}

export enum EmpleadoGenero{
    FEMENINO='FEMENINO',
    MASCULINO='MASCULINO',
    OTRO='OTRO'
}

export enum EmpleadoEstado{
    ACTIVO='ACTIVO',
    DE_VACACIONES='DE VACACIONES',
}