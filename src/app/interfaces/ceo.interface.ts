import { Usuario } from "./usuario.interface"

export interface Ceo{
    id?: string,
    nombre: string,
    apellidos: string,
    genero:CeoGenero
    usuario: Usuario
}


export enum CeoGenero{
    FEMENINO = 'FEMENINO',
    MASCULINO = 'MASCULINO',
    OTRO = 'OTRO'
}