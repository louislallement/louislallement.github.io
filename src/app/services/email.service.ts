import { Injectable } from '@angular/core';
import { from, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs';
import emailjs from '@emailjs/browser';

export interface ContactForm {
  name: string;
  email: string;
  message: string;
}

export interface EmailResponse {
  success: boolean;
  message: string;
}

// ====================================================================
// A CONFIGURER : creer un compte gratuit sur https://www.emailjs.com
// 1. Creer un "Email Service" (Gmail, Outlook...) → copier le Service ID
// 2. Creer un "Email Template" avec les variables {{from_name}}, {{from_email}}, {{message}}
// 3. Copier la Public Key depuis Account > API Keys
// ====================================================================
const EMAILJS_SERVICE_ID = 'service_vqs6hqm';
const EMAILJS_TEMPLATE_ID = 'template_oh1ckob';
const EMAILJS_PUBLIC_KEY = 'zRpvGG_P0ES162dY4';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  sendEmail(contactForm: ContactForm): Observable<EmailResponse> {
    const templateParams = {
      from_name: contactForm.name,
      from_email: contactForm.email,
      message: contactForm.message,
    };

    return from(
      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY),
    ).pipe(
      map(() => ({
        success: true,
        message: 'Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.',
      })),
      catchError(() =>
        of({
          success: false,
          message: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        }),
      ),
    );
  }
}
