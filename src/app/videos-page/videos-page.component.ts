import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../shared/components/header/header.component";
import { FooterComponent } from "../shared/components/footer/footer.component";
import { VideoplayerComponent } from "../shared/components/videoplayer/videoplayer.component";
import { VideoListComponent } from "./video-list/video-list.component";
import { VideoServiceService } from '../shared/services/video-service/video-service.service';
import { CommonModule } from '@angular/common';
import { StartAnimationComponent } from "../start-animation/start-animation.component";
import { InactivityService } from '../shared/services/inactivity-service/inactivity.service';

@Component({
  selector: 'app-videos-page',
  imports: [HeaderComponent, FooterComponent, VideoplayerComponent, VideoListComponent, CommonModule, StartAnimationComponent],
  templateUrl: './videos-page.component.html',
  styleUrl: './videos-page.component.scss'
})
export class VideosPageComponent {
  videoService = inject(VideoServiceService);
  inactivityService = inject(InactivityService);
 
    constructor() {
      this.inactivityService.firstView = true;
    }
}
