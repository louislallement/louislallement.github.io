import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private http = inject(HttpClient);

  // Utiliser EmailJS ou un service similaire pour l'envoi d'emails
  private readonly EMAILJS_SERVICE_ID = 'service_your_service_id';
  private readonly EMAILJS_TEMPLATE_ID = 'template_your_template_id';
  private readonly EMAILJS_PUBLIC_KEY = 'your_public_key';
  private readonly RECIPIENT_EMAIL = 'hilaire.foillard@gmail.com';

  /**
   * Envoie un email via EmailJS
   */
  sendEmail(contactForm: ContactForm): Observable<EmailResponse> {
    console.log('Envoi d\'email pour:', contactForm);
    
    // Pour l'instant, simuler l'envoi d'email
    return this.simulateEmailSending(contactForm);
    
    // Code pour EmailJS (à décommenter quand configuré)
    /*
    const templateParams = {
      from_name: contactForm.name,
      from_email: contactForm.email,
      message: contactForm.message,
      to_email: this.RECIPIENT_EMAIL
    };

    return this.http.post('https://api.emailjs.com/api/v1.0/email/send', {
      service_id: this.EMAILJS_SERVICE_ID,
      template_id: this.EMAILJS_TEMPLATE_ID,
      user_id: this.EMAILJS_PUBLIC_KEY,
      template_params: templateParams
    }).pipe(
      map(() => ({
        success: true,
        message: 'Email envoyé avec succès !'
      })),
      catchError(error => {
        console.error('Erreur envoi email:', error);
        return of({
          success: false,
          message: 'Erreur lors de l\'envoi de l\'email'
        });
      })
    );
    */
  }

  /**
   * Simulation de l'envoi d'email pour les tests
   */
  private simulateEmailSending(contactForm: ContactForm): Observable<EmailResponse> {
    console.log('=== SIMULATION ENVOI EMAIL ===');
    console.log('Destinataire:', this.RECIPIENT_EMAIL);
    console.log('Nom:', contactForm.name);
    console.log('Email:', contactForm.email);
    console.log('Message:', contactForm.message);
    console.log('===============================');

    // Simuler un délai d'envoi
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({
          success: true,
          message: 'Email envoyé avec succès ! Je vous répondrai dans les plus brefs délais.'
        });
        observer.complete();
      }, 1000);
    });
  }

  /**
   * Valide le format de l'email
   */
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Valide le formulaire complet
   */
  validateForm(form: ContactForm): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!form.name || form.name.trim().length < 2) {
      errors.push('Le nom doit contenir au moins 2 caractères');
    }

    if (!form.email || !this.validateEmail(form.email)) {
      errors.push('Veuillez saisir une adresse email valide');
    }

    if (!form.message || form.message.trim().length < 10) {
      errors.push('Le message doit contenir au moins 10 caractères');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

