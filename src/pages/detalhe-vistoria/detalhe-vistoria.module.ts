import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheVistoriaPage } from './detalhe-vistoria';

@NgModule({
  declarations: [
    DetalheVistoriaPage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheVistoriaPage),
  ],
})
export class DetalheVistoriaPageModule {}
