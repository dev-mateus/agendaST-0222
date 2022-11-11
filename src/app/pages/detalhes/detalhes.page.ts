import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router} from '@angular/router';
import { DadosService } from 'src/app/services/dados.service';
import { AlertController, NavController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//import
import { Contato } from 'src/app/models/contato';//model Contato
import { Guid } from 'guid-typescript';//lib Guid

@Component({
  selector: 'app-detalhes',
  templateUrl: './detalhes.page.html',
  styleUrls: ['./detalhes.page.scss'],
})

export class DetalhesPage implements OnInit {

  
  private detalhesContato : Contato //objeto que recebe os valores do array criado na classe "service"
  public modoEdicao = false //objeto modo de edição
  public contatoForm : FormGroup //objeto usado para validar o formulário

  constructor(
    private objDadosService : DadosService, //objeto usado para chamar métodos da classe "service"
    private objRoute : ActivatedRoute, //objeto usado para 'pegar' o id do contato passado através da pagina inicial
    private alertController: AlertController,// objeto usado para criar a caixa de alerta
    public formBuilder : FormBuilder, // objeto construtor de formulário
    public navCtrl: NavController, //objeto usado voltar de pagina
    ) { }

    // método que cria (renderiza) uma caixa de alerta
    async presentAlert() {
      const alert = await this.alertController.create({
        header: 'Deseja remover o contato da lista?!',
        buttons: [
          {
            text: 'Não',
            handler: () => {
              ;
            },
          },
          {
            text: 'Sim',
            handler: () => {
              //botão 'Sim' chama o método que exclui contato
              this.ExcluirContato(),
              this.navCtrl.back()
              ;
            },
          },
        ],
      });
      await alert.present();
    }

  //método é carregado junto com a página HTML  
  ngOnInit() {

    //item 1

    this.detalhesContato = { id: Guid.createEmpty(), nome:'', sobrenome:'', tipo:'', telefone:'', email:''}

    // validação do formulário enviado pela pagina HTML
    this.contatoForm = this.formBuilder.group({
      id: [this.detalhesContato.id],
      nome : [this.detalhesContato.nome, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(15)])],
      sobrenome : [this.detalhesContato.sobrenome],
      tipo : [this.detalhesContato.tipo, Validators.required],
      telefone : [this.detalhesContato.telefone, Validators.required],
      email : [this.detalhesContato.email, Validators.email]
      })
    
    // captura do id do contato
    const id : string = String(this.objRoute.snapshot.paramMap.get('id'))

    //item 3
    if (id != 'add'){
      this.objDadosService.FiltraContatosId(id).then(array => this.detalhesContato = array)

    }
    else{
      
      this.modoEdicao = true
    }
  }

  IniciarEdicao(){
    this.modoEdicao = true
  }

  EncerrarEdicao(){
    
    const id : string = String(this.objRoute.snapshot.paramMap.get('id'))
    
    if(id != 'add'){
      if (this.contatoForm.valid){
        //alterar contato
        this.objDadosService.AlterarContatoId(id, this.contatoForm.value)
        this.modoEdicao = false
      }
    }
    
    else{
      if (this.contatoForm.valid){
        //item 1
        this.objDadosService.InserirContato(this.contatoForm.value)
        this.modoEdicao = false        
      }
    }
  }

  ExcluirContato(){
    // captura do id do contato
    const id : string = String(this.objRoute.snapshot.paramMap.get('id'))
    
    this.objDadosService.ExcluirContatoId(id)
  }

}
