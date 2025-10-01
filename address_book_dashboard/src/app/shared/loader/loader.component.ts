import { Component } from '@angular/core';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
// Animation options
  LoaderOptions: AnimationOptions = {
    path: '/assets/animation/Address Book.json',
    loop: true,
    autoplay: true
  };
}
