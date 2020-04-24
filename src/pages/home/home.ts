import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { GroceriesServiceProvider } from '../../providers/groceries-service/groceries-service';
import { InputDialogueServiceProvider } from '../../providers/input-dialogue-service/input-dialogue-service';
import { SocialSharing } from '@ionic-native/social-sharing';
import { ItemSliding } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  title = "Grocery List";

  items = []
  errorMessage: string;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public dataService: GroceriesServiceProvider, public alertCtrl: AlertController, public socialSharing: SocialSharing, public inputDialogService: InputDialogueServiceProvider) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.dataService.getItems().subscribe(
        items => this.items = items,
        error => this.errorMessage = <any>error);
      
  }

  removeItem(item, id){
    console.log("Removing Item: ", item.name);
    const toast = this.toastCtrl.create({
      message: 'Removing Item - ' + item.name,
      duration: 3000
    });
    toast.present();
    this.dataService.removeItem(id);
  }

  shareItem(item, index){
    console.log("Sharing Item: ", item, index);
    const toast = this.toastCtrl.create({
      message: 'Sharing Item - ' + item.name,
      duration: 3000
    });
    toast.present();
    let message = "Grocery Item - Name :" + item.name + " - Quantity: " + item.quantity;
    let subject = "Shared via Groceries app";

    this.socialSharing.share(message, subject).then(() => {
      // Sharing via email is possible
      console.log("Shared successfully!");
    }).catch(() => {
      // Sharing via email is not possible
      console.log("Error while sharing");
      console.error();
    });
  }

  editItem(item, index){
    const toast = this.toastCtrl.create({
      message: 'Editing Item - ' + item.name,
      duration: 3000
    });
    toast.present();

    console.log("Editing item: ", item);
    this.inputDialogService.showPrompt(item, index);
    
  }

  addItem(){
    console.log("Adding new item")
    this.inputDialogService.showPrompt();

  }

  markDone(item, index){
    console.log('Marked bought for', item.name)
    //item.image= 'assets/imgs/checkbox.jpg'
    const toast = this.toastCtrl.create({
      message: 'Marked complete - ' + item.name,
      duration: 3000
    });
    toast.present();
    item.blurb = "Purchased!"
    this.dataService.editItem(item, index);
  }

  collapse(slidingItem: ItemSliding){
    slidingItem.close();
  }

}







