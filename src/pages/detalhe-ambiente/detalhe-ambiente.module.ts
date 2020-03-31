import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetalheAmbientePage } from './detalhe-ambiente';

@NgModule({
  declarations: [
    DetalheAmbientePage,
  ],
  imports: [
    IonicPageModule.forChild(DetalheAmbientePage),
  ],
})
export class DetalheAmbientePageModule {}
