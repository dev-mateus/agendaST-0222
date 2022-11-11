import { Injectable } from '@angular/core';

//imports
import { Contato } from '../models/contato';
import { Guid } from 'guid-typescript'
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class DadosService {


  constructor( private storage : Storage) { }

  //item 1 - inserir
  InserirContato(dadosRecebidos : Contato){
    dadosRecebidos.id = Guid.create()
    this.storage.set(dadosRecebidos.id.toString(), JSON.stringify(dadosRecebidos))
  }

  //item 2 - ler tudo
  EnviarTodosContatos(){
    let arrayContatos : Contato [] = []
    this.storage.forEach((valor : string) => {const contato : Contato = JSON.parse(valor); arrayContatos.push(contato)})
    return arrayContatos

  }

  //item 3 - filtrar
  async FiltraContatosId(id : string){
    return JSON.parse(await this.storage.get(id))
  }

  //item 4 - excluir
  ExcluirContatoId(id : string){
    this.storage.remove(id)

  }

  //item 5 - alterar contato
  AlterarContatoId(id: string, dadosRecebidos: Contato){
    dadosRecebidos.id = Guid.parse(id)
    this.storage.set(dadosRecebidos.id.toString(), JSON.stringify(dadosRecebidos))
  }
  
}
