import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Hls from 'hls.js';
import { VideoServiceService } from '../../services/video-service/video-service.service';
import { MatIcon } from '@angular/material/icon';
import { HttpsService } from '../../services/https-service/https.service';
import { InactivityService } from '../../services/inactivity-service/inactivity.service';

@Component({
  selector: 'app-videoplayer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon],
  templateUrl: './videoplayer.component.html',
  styleUrls: ['./videoplayer.component.scss']
})
export class VideoplayerComponent implements AfterViewInit {
  @ViewChild('videoPlayerFull', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  http = inject(HttpsService);
  videoService = inject(VideoServiceService);
  availableQualities: { level: number; label: string }[] = [];
  currentQuality: number = -1;
  hls: Hls | null = null;
  showOverlay: boolean = true;
  isLoading: boolean = true;
  isPlaying: boolean = false;
  isMuted: boolean = false;
  currentVolume: number = 0.5;
  progress: number = 0;
  controlsVisible: boolean = true;
  isFullscreen: boolean = false;
  controlsHideTimeout: any;
  currentVideoData: any = null;
  videoEnded: boolean = false;
  video!: HTMLVideoElement
  inactivityService = inject(InactivityService);
  formatTime = this.inactivityService.formatTime.bind(this.inactivityService);
  currentTime: number = 0;
  totalDuration: number = 0;


  /**
   * Called after the view has been initialized.
   * Sets up the control visibility, listener for fullscreen mode, and starts fetching and playing the video.
   */
  ngAfterViewInit(): void {
    this.setupControlVisibility();
    this.setupFullscreenListener();
    this.fetchAndPlayVideo();
    this.addEventListeners();

  }

  /**
   * Adds event listeners to the video element to set the isLoading property
   * based on the video's state. This is necessary because the video's readyState
   * property is not always reliable.
   */
  addEventListeners() {
    this.video = this.videoElement.nativeElement
    this.video.addEventListener('playing', () => {
      this.isLoading = false;
    });
    this.video.addEventListener('canplay', () => {
      this.isLoading = false;
    });
    this.video.addEventListener('waiting', () => {
      this.isLoading = true;
    });
    this.video.addEventListener('stalled', () => {
      this.isLoading = true;
    });
    this.video.addEventListener('loadstart', () => {
      this.isLoading = true;
    });
  }

  /**
   * Fetches the video metadata and starts playing the video.
   * @see initHlsPlayer
   */
  fetchAndPlayVideo(): void {
    if (this.videoService.currentVideo() === null) return;
    const apiUrl = `http://127.0.0.1:8000/videoflix/api/videos/${this.videoService.currentVideo()}/`;
    this.http.get(apiUrl).subscribe((data: any) => {
      if (data.hls_master_playlist_url) {
        this.currentVideoData = data;
        this.initHlsPlayer(data.hls_master_playlist_url, data.user_progress?.last_viewed_position);
      } else {
        console.error('HLS master playlist URL is missing in the response.');
      }
    });
  }

  /**
   * Initializes the Hls.js player instance and loads the video from the provided
   * HLS master playlist URL. If the video has been previously viewed, the player
   * will start at the last viewed position.
   */
  initHlsPlayer(playlistUrl: string, lastViewedPosition?: number): void {
    if (!Hls.isSupported()) {
      this.setupNativePlayer(playlistUrl, lastViewedPosition);
      return;
    }
    this.hls = this.createHlsInstance();
    this.hls.loadSource(playlistUrl);
    this.hls.attachMedia(this.videoElement.nativeElement);
    this.hls.on(Hls.Events.MANIFEST_PARSED, () => this.onManifestParsed(lastViewedPosition));
    this.hls.on(Hls.Events.ERROR, (event, data) => this.handleHlsError(data));
  }

  /**
   * Sets up the native video player using the provided HLS playlist URL.
   * If the video has been previously viewed, the player will start at the last viewed position.
   * This method is called only if the browser does not support MSE (Media Source Extensions) or Hls.js.
   */
  setupNativePlayer(playlistUrl: string, lastViewedPosition?: number): void {
    this.videoElement.nativeElement.src = playlistUrl;
    if (lastViewedPosition && lastViewedPosition > 0) {
      this.videoElement.nativeElement.currentTime = lastViewedPosition;
    }
  }

  /**
   * Creates an instance of Hls.js with the desired configuration.
   * The configuration used is as follows:
   * - `enableWorker`: Set to `true` to enable web worker support.
   * - `abrEwmaFastLive`: Set to `2.0` to adjust the fast live bitrate calculation.
   * - `abrEwmaSlowLive`: Set to `5.0` to adjust the slow live bitrate calculation.
   * - `abrMaxWithRealBitrate`: Set to `true` to adjust the maximum bitrate for the
   *   ABR (Adaptive Bitrate) algorithm.
   * @returns An instance of Hls.js.
   */
  createHlsInstance(): Hls {
    return new Hls({
      enableWorker: true,
      abrEwmaFastLive: 2.0,
      abrEwmaSlowLive: 5.0,
      abrMaxWithRealBitrate: true,
    });
  }

  /**
   * Called when the manifest has been parsed by Hls.js.
   * @param lastViewedPosition The last viewed position in the video, if available.
   * Updates the list of available video qualities and sets the video player to the last viewed position if available.
   * Also sets the `isPlaying` flag to true and `isLoading` to false.
   */
  onManifestParsed(lastViewedPosition?: number): void {
    this.availableQualities = this.hls?.levels.map((level, index) => ({
      level: index,
      label: `${level.height}p`,
    })) || [];
    if (this.hls) this.hls.nextLevel = -1;
    if (lastViewedPosition && lastViewedPosition > 0) {
      this.videoElement.nativeElement.currentTime = lastViewedPosition;
    }
    this.isPlaying = true;
    this.isLoading = false;
  }

  /**
   * Handles errors raised by Hls.js.
   * If the error is a buffer stalled error, logs a warning to the console.
   * @param data The error data object passed by Hls.js.
   */
  handleHlsError(data: any): void {
    if (data.details === 'bufferStalledError') {
      console.warn('Buffer stalled due to low network speed.');
    }
  }

  /**
   * Toggles the video player's play/pause state.
   * If the video is paused or has ended, plays the video and sets the `isPlaying` flag to true.
   * If the video is playing, pauses the video and sets the `isPlaying` flag to false.
   * Also toggles the overlay visibility based on the player's state.
   */
  togglePlay(): void {
    if (!this.video) { return; }
    if (this.video.paused || this.video.ended) {
      this.video.play();
      this.isPlaying = true;
      this.showOverlay = false;
      this.progress = (this.video.currentTime / this.video.duration) * 100;
    } else {
      this.video.pause();
      this.isPlaying = false;
      this.showOverlay = true;
    }
  }

  /**
   * Toggles the video's muted state.
   * If the video is currently muted, unmutes it and sets the `isMuted` flag to false.
   * If the video is not muted, mutes it and sets the `isMuted` flag to true.
   */
  toggleMute(): void {
    this.video.muted = !this.video.muted;
    this.isMuted = this.video.muted;
  }

  /**
   * Updates the video player's volume based on input from the volume slider.
   * If the volume is set to 0, mutes the video and sets the `isMuted` flag to true.
   * If the volume is above 0, unmutes the video and sets the `isMuted` flag to false.
   * @param event The event object passed by the input element's change event.
   */
  changeVolume(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.currentVolume = parseFloat(input.value);
    if (this.currentVolume === 0) {
      this.isMuted = true;
      this.video.muted = true;
    } else {
      this.isMuted = false;
      this.video.muted = false;
    }
    this.video.volume = this.currentVolume;
  }

  /**
   * Updates the video player's progress bar and saves the user's progress
   * whenever the video's time is updated.
   * The progress is calculated as a percentage of the video's current time
   * relative to its total duration.
   * If the video has ended, the user's progress is saved, the overlay is shown,
   * and the `videoEnded` flag is set to true.
   */
  updateProgress(): void {
    const video = this.videoElement.nativeElement;
    this.progress = (video.currentTime / video.duration) * 100;
    let adjustedPosition = Math.max(0, video.currentTime - 1);
    this.videoService.currentProgress.set(adjustedPosition);
    this.videoService.videoDuration.set(video.duration);
    this.currentTime = Math.floor(video.currentTime);
    this.totalDuration = Math.floor(video.duration) || 0;
    this.inactivityService.resetInactivityTimer();
    if (video.ended) {
      this.videoEnded = true;
      this.showOverlay = true;
      this.videoService.saveUserProgress(this.videoEnded);

    }
  }

  /**
   * Seeks the video to a specific time based on the user's click position on the progress bar.
   * Calculates the new current time as a percentage of the total video duration.
   * @param event The MouseEvent triggered by the click, containing the click position and target element.
   */
  seek(event: MouseEvent): void {
    const video = this.videoElement.nativeElement;
    const progressBar = event.currentTarget as HTMLElement;
    const clickPosition = event.offsetX / progressBar.clientWidth;
    video.currentTime = clickPosition * video.duration;
    this.progress = video.currentTime;
  }

  /**
   * Changes the video quality to the selected level from the quality select element.
   * Pauses the video, switches to the new level, and resumes playback from the same position.
   * @param event The Event triggered by the select element change, containing the target element and value.
   */
  changeQuality(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const level = parseInt(selectElement.value, 10);
    if (!isNaN(level) && this.hls) {
      const currentTime = this.videoElement.nativeElement.currentTime;
      this.videoElement.nativeElement.pause();
      this.hls.currentLevel = level;
      this.hls.once(Hls.Events.LEVEL_SWITCHED, () => {
        this.videoElement.nativeElement.currentTime = currentTime;
        this.videoElement.nativeElement.play();
        this.isPlaying = true;
      });
    }
  }

  /**
   * Toggles the video player's fullscreen state.
   * If the video is currently not in fullscreen mode, requests fullscreen mode
   * and sets the `isFullscreen` flag to true.
   * If the video is currently in fullscreen mode, exits fullscreen mode
   * and sets the `isFullscreen` flag to false.
   */
  toggleFullscreen(): void {
    const videoContainer = this.videoElement.nativeElement.parentElement;
    if (!document.fullscreenElement) {
      videoContainer?.requestFullscreen();
      this.isFullscreen = true;
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
    }
  }

  /**
   * Shows the custom video controls by setting the `controlsVisible` flag to true.
   * Also clears any existing timeout and sets a new timeout to hide the controls
   * after 1.5 seconds of inactivity.
   */
  showControls(): void {
    this.controlsVisible = true;
    clearTimeout(this.controlsHideTimeout);
    this.controlsHideTimeout = setTimeout(() => {
      this.controlsVisible = false;
    }, 1500);
  }

  /**
   * Sets up a listener for the `fullscreenchange` event on the document.
   * Whenever the video player enters or exits fullscreen mode, the
   * `isFullscreen` flag is updated accordingly.
   */
  setupFullscreenListener(): void {
    document.addEventListener('fullscreenchange', () => {
      this.isFullscreen = !!document.fullscreenElement;
    });
  }

  /**
   * Sets up a listener for the `mousemove` event on the video element.
   * Whenever the user moves their mouse over the video element, the
   * `showControls` method is called to show the custom video controls.
   */
  setupControlVisibility(): void {
    this.videoElement.nativeElement.addEventListener('mousemove', () => this.showControls());
  }

  /**
   * Closes the video player by saving the user's progress and pausing the video.
   * After a short delay, it resets the current video, updates the started and viewed
   * video lists, and removes the 'no-scroll' class from the document body to restore scrolling.
   */
  closeVideo(): void {
    if (this.currentVideoData.user_progress != null) {
      this.videoService.saveUserProgress(this.currentVideoData.user_progress.viewed);
    } else {
      this.videoService.saveUserProgress(this.videoEnded);
    }

    this.videoElement.nativeElement.pause();
    setTimeout(() => {
      this.videoService.currentVideo.set(null);
      this.videoService.filterIfStarted();
      this.videoService.filterIfViewed();
      document.body.classList.remove('no-scroll');
    }, 200);
  }

  /**
   * Starts the video playback from the beginning.
   * Hides the overlay, plays the video, and sets the `isPlaying` flag to true.
   */
  startVideo(): void {
    this.showOverlay = false;
    this.videoElement.nativeElement.play();
    this.isPlaying = true;
  }

  /**
   * Returns the current progress of the video player as a percentage of the video's total duration.
   * The progress is calculated based on the video's current time relative to its total duration.
   * @returns The current progress of the video player in the range [0, 100].
   */
  getProgress(): number {
    return this.progress;
  }
}


