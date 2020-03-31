import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImagemModalPage } from './imagem-modal';

@NgModule({
  declarations: [
    ImagemModalPage,
  ],
  imports: [
    IonicPageModule.forChild(ImagemModalPage),
  ],
})
export class ImagemModalPageModule {}
