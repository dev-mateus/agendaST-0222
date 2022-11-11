import { Guid } from "guid-typescript";

export interface Contato {
    id: Guid,
    nome:  string,
    sobrenome: string,
    tipo: string,
    telefone: string,
    email: string
}
