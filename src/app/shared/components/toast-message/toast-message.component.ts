import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast-message/toast.service';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-toast-message',
  imports: [CommonModule, MatIcon],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.scss'
})
export class ToastMessageComponent {
  toastService = inject(ToastService);
}
