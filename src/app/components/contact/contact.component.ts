import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactForm, EmailService } from '../../services/email.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  private emailService = inject(EmailService);

  contactForm: ContactForm = {
    name: '',
    email: '',
    message: ''
  };

  isSubmitting = false;
  submitMessage = '';
  submitSuccess = false;
  validationErrors: string[] = [];

  onSubmit(): void {
    console.log('Soumission du formulaire:', this.contactForm);
    
    // Réinitialiser les messages
    this.submitMessage = '';
    this.validationErrors = [];
    this.submitSuccess = false;

    // Valider le formulaire
    const validation = this.emailService.validateForm(this.contactForm);
    if (!validation.valid) {
      this.validationErrors = validation.errors;
      return;
    }

    // Envoyer l'email
    this.isSubmitting = true;
    this.emailService.sendEmail(this.contactForm).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = response.success;
        this.submitMessage = response.message;
        
        if (response.success) {
          // Réinitialiser le formulaire
          this.contactForm = {
            name: '',
            email: '',
            message: ''
          };
        }
      },
      error: (error) => {
        console.error('Erreur lors de l\'envoi:', error);
        this.isSubmitting = false;
        this.submitSuccess = false;
        this.submitMessage = 'Une erreur est survenue lors de l\'envoi du message.';
      }
    });
  }

  onInputChange(): void {
    // Effacer les messages d'erreur quand l'utilisateur tape
    if (this.validationErrors.length > 0) {
      this.validationErrors = [];
    }
    if (this.submitMessage) {
      this.submitMessage = '';
    }
  }
}