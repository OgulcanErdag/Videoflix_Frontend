import { Component, computed, signal} from '@angular/core';

@Component({
  selector: 'app-start-animation',
  imports: [],
  templateUrl: './start-animation.component.html',
  styleUrl: './start-animation.component.scss'
})
export class StartAnimationComponent  { 
   gridSize = signal(300)
   gridItems = computed(() => Array.from({ length: this.gridSize() }, (_, i) => i));
}



