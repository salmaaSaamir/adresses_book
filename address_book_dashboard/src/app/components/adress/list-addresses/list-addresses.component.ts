import { Component } from '@angular/core';
import { LoaderComponent } from "../../../shared/loader/loader.component";

@Component({
  selector: 'app-list-addresses',
  standalone: true,
  imports: [LoaderComponent],
  templateUrl: './list-addresses.component.html',
  styleUrl: './list-addresses.component.css'
})
export class ListAddressesComponent {

}
