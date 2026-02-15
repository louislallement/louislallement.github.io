import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { EmailService } from '../../services/email.service';
import { ScrollAnimateDirective } from '@app/directives/scroll-animate.directive';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule, ScrollAnimateDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  private emailService = inject(EmailService);
  private fb = inject(FormBuilder);

  contactForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;

  onSubmit(): void {
    // Reinitialiser les messages
    this.submitMessage = '';
    this.submitSuccess = false;

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValue = this.contactForm.getRawValue();

    // Envoyer l'email
    this.isSubmitting = true;
    this.emailService
      .sendEmail({
        name: formValue.name ?? '',
        email: formValue.email ?? '',
        message: formValue.message ?? '',
      })
      .subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = response.success;
          this.submitMessage = response.message;

          if (response.success) {
            this.contactForm.reset();
          }
        },
        error: () => {
          this.isSubmitting = false;
          this.submitSuccess = false;
          this.submitMessage =
            "Une erreur est survenue lors de l'envoi du message.";
        },
      });
  }
}
