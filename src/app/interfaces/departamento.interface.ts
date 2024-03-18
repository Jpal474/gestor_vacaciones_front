import { Empresa } from "./empresa.interface";

export interface Departamento{
    id?:number,
    nombre: string,
    empresa?: Empresa
}