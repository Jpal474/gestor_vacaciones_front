import { Rol } from "./rol.interface";

export interface Usuario {
    id?:string;
    nombre_usuario: string;
    correo: string;
    contraseña?: string;
    rol?: Rol;
}