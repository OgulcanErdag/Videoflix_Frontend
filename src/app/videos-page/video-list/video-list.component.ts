import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { HorizontalDirectivesDirective } from '../../shared/directives/horizontal-directives.directive';
import { VideoServiceService } from '../../shared/services/video-service/video-service.service';
import { HttpsService } from '../../shared/services/https-service/https.service';

@Component({
  selector: 'app-video-list',
  imports: [CommonModule, HorizontalDirectivesDirective],
  templateUrl: './video-list.component.html',
  styleUrl: './video-list.component.scss',
  standalone: true,
})
export class VideoListComponent{
  videoService = inject(VideoServiceService);

}
