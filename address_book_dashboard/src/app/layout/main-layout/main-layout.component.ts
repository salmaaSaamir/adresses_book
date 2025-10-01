import { Component } from '@angular/core';
import { NavBarComponent } from "../../shared/nav-bar/nav-bar.component";
import { FooterComponent } from '../../shared/footer/footer.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NavBarComponent, FooterComponent,RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
