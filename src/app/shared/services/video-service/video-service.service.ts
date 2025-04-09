import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { AuthService } from '../auth-service/auth.service';
import { HttpsService } from '../https-service/https.service';

@Injectable({
  providedIn: 'root'
})
export class VideoServiceService {
  currentVideo = signal<number | null>(null);
  authService = inject(AuthService)
  http = inject(HttpsService)
  currentProgress = signal<number>(0)
  videoDuration = signal<number>(0)
  hoverTimeout: any = null;
  videoData = signal<any[]>([]);
  hoveredVideoId = signal<string | null>(null)
  genres = signal<{ [key: string]: any[] }>({});
  currentBackgroundVideo = signal<any | null>(null);
  startedVideos = signal<any[]>([]);
  viewedVideos = signal<any[]>([]);

  /**
   * Initialize the service. Calls getVideoData() to fetch video data from the API
   * and populate the videoData signal. Then it calls other methods to map the
   * genres, play a random background video, filter the videos that have been
   * started and viewed.
   */
  constructor() {
    this.getVideoData();
  }

  /**
   * Get all video data from the API and store it in the videoData signal.
   * Then call other methods to map the genres, play a random background video,
   * filter the videos that have been started and viewed.
   * This is usually called once when the service is initialized.
   */
  getVideoData() {
    this.http.get<any[]>('http://127.0.0.1:8000/videoflix/api/videos/')
      .subscribe(data => {
        this.videoData.set(data);
        this.mapGenres(this.videoData());
        this.playRandomBackgroundVideo();
        this.filterIfStarted();
        this.filterIfViewed()
      });
  }

  /**
   * Filter the video data for videos that have been started (user_progress.last_viewed_position > 0)
   * but not finished (user_progress.viewed === false). Set the startedVideos signal to this filtered array.
   */
  filterIfStarted(): void {
    let startedVideos = this.videoData().filter(video =>
      video.user_progress &&
      video.user_progress.last_viewed_position > 0 &&
      video.user_progress.viewed === false
    );
    this.startedVideos.set(startedVideos);
  }

  /**
   * Filters the video data based on whether the user has viewed the video or not
   * and updates the viewedVideos signal with the result.
   */
  filterIfViewed(): void {
    let viewedVideos = this.videoData().filter(video =>
      video.user_progress && video.user_progress.viewed === true
    );
    this.viewedVideos.set(viewedVideos);
  }

  /**
   * Maps the provided videos to a dictionary where the keys are the genres of the videos
   * and the values are arrays of videos that belong to that genre.
   * @param videos the videos to be mapped
   */
  mapGenres(videos: any[]): void {
    const genreMap: { [key: string]: any[] } = {};
    videos.forEach(video => {
      const genre = video.genre;
      if (!genreMap[genre]) {
        genreMap[genre] = [];
      }
      genreMap[genre].push(video);
    });
    this.genres.set(genreMap);
  }

  /**
   * Sets the hovered video ID to the provided video ID and list type
   * after a 500ms delay to prevent rapid hover events from triggering
   * the hover effect. If the hovered video ID is already set to the
   * same value, the function does nothing.
   * @param videoId the ID of the video
   * @param listType the type of list that the video is in, e.g. "genre-Action"
   */
  onMouseEnter(videoId: string, listType: string): void {
    const uniqueKey = `${videoId}-${listType}`;
    if (this.hoveredVideoId() === uniqueKey) return;
    this.hoverTimeout = setTimeout(() => {
      this.hoveredVideoId.set(uniqueKey);
    }, 500);
  }

  /**
   * Resets the hovered video ID to null when the mouse leaves the video list item.
   * This function is called on mouseleave event of the video list item.
   * It clears the timeout that is set on mouseenter event of the video list item.
   */
  onMouseLeave(): void {
    clearTimeout(this.hoverTimeout);
    this.hoveredVideoId.set(null);
  }

  /**
   * Resets the video player's current time to 0 and starts playback if the video is currently hovered.
   * The operation is only performed if the video's unique key matches the hovered video ID and the video player element is valid.
   * Logs a warning if video playback is interrupted.
   * @param videoPlayer - The HTML video element to be controlled.
   * @param videoId - The unique identifier of the video.
   * @param listType - The list type to which the video belongs (e.g., 'started', 'viewed', etc.).
   */
  onVideoLoaded(videoPlayer: HTMLVideoElement, videoId: string, listType: string): void {
    const uniqueKey = `${videoId}-${listType}`;
    if (this.hoveredVideoId() === uniqueKey && videoPlayer && document.contains(videoPlayer)) {
      videoPlayer.currentTime = 0;
      videoPlayer.play().catch(error => console.warn("Video play interrupted:", error));
    }
  }

  /**
   * Pauses the video and resets its current time if it has played for 5 seconds or more.
   * This function is triggered during the video's time update event.
   */
  checkVideoTime(videoPlayer: HTMLVideoElement): void {
    if (videoPlayer.currentTime >= 5) {
      videoPlayer.pause();
      videoPlayer.currentTime = 0;
    }
  }

  /**
   * Retrieves a list of genre keys from the current video data.
   * @returns {string[]} An array of genre keys.
   */
  public getGenreKeys(): string[] {
    return Object.keys(this.genres());
  }

  /**
   * Plays a random video from the video library as the current background video.
   * Does nothing if the video library is empty.
   */
  playRandomBackgroundVideo(): void {
    const videos = this.videoData();
    if (!videos.length) return;
    const randomIndex = Math.floor(Math.random() * videos.length);
    this.currentBackgroundVideo.set(videos[randomIndex]);
  }

  /**
   * When the current background video ends, play a random video from the video library.
   */
  onBackgroundVideoEnded(): void {
    this.playRandomBackgroundVideo();
  }

  /**
   * Selects a video for playback.
   * Sets the currentVideo signal to the videoId provided.
   * Also adds the 'no-scroll' class to the document body to prevent scrolling.
   * @param videoId The ID of the video to select.
   */
  selectVideo(videoId: number): void {
    this.currentVideo.set(videoId);
    document.body.classList.add('no-scroll');
  }

  /**
   * Saves the user's progress in the currently playing video.
   * If the user has watched the video until the end, the progress is saved as 0 and the video is marked as viewed.
   * Otherwise, the current progress is saved in seconds.
   * The progress is saved to the server as a PATCH request to /video/{videoId}/progress/.
   * If the request is successful, the video data is reloaded.
   */
  saveUserProgress(ended: boolean): void {
    if (!this.currentVideo()) return;
    let apiUrl = `http://127.0.0.1:8000/videoflix/api/video/${this.currentVideo()}/progress/`;
    if (this.currentProgress() >= 0) {
      let payload = {
        last_viewed_position: this.currentProgress(),
        viewed: ended
      };
      this.http.patch(apiUrl, payload).subscribe(
        response => {
          this.getVideoData();
        },
        error => console.error('Error saving progress:', error)
      );
    }
  }

  /**
   * Sets the hoveredVideoId signal to the videoId and listType provided
   * after a 500ms delay. This is necessary to prevent the video from playing
   * when the user is scrolling.
   * @param videoId The id of the video to set as hovered.
   * @param listType The type of list the video is from (e.g. "genre-action").
   */
  onTouchStart(videoId: string, listType: string): void {
    this.hoverTimeout = setTimeout(() => {
      this.hoveredVideoId.set(`${videoId}-${listType}`);
    }, 500);
  }

  /**
   * Resets the hoveredVideoId signal when the user stops touching the screen.
   * This is necessary to prevent the video from playing when the user is scrolling.
   */
  onTouchEnd(): void {
    clearTimeout(this.hoverTimeout);
    this.hoveredVideoId.set(null);
  }
}
