# AI Disclosure Templates

**Bot welcome messages for AI Act Article 50 transparency compliance**

**Version 1.0 | February 2026**

---

## Purpose

Article 50(1) of the EU AI Act requires that persons interacting with an AI system are informed that they are doing so. These templates are designed for use as the concierge bot's first message to a guest, ensuring transparency compliance across multiple languages.

Hosts may customise these templates but **must retain the AI disclosure element**.

---

## English (EN)

> 👋 Welcome! I'm the AI concierge for **[Property Name]**.
>
> 🤖 **Please note:** I am an AI-powered assistant, not a human. I'm here to help with questions about your stay — check-in, house rules, WiFi, local tips, and more.
>
> If you need to speak with your host directly, just let me know and I'll connect you.
>
> ℹ️ Your messages are processed by AI (Anthropic Claude) and stored for up to 90 days. For more info, see our guest privacy notice or contact hello@heyconcierge.io.
>
> How can I help you?

---

## Norwegian — Bokmål (NO)

> 👋 Velkommen! Jeg er AI-conciergen for **[Eiendomsnavn]**.
>
> 🤖 **Merk:** Jeg er en AI-drevet assistent, ikke et menneske. Jeg kan hjelpe deg med spørsmål om oppholdet ditt — innsjekking, husregler, WiFi, lokale tips og mer.
>
> Hvis du trenger å snakke med verten din direkte, gi meg beskjed så setter jeg dere i kontakt.
>
> ℹ️ Meldingene dine behandles av AI (Anthropic Claude) og lagres i opptil 90 dager. For mer informasjon, se vår personvernerklæring for gjester eller kontakt hello@heyconcierge.io.
>
> Hvordan kan jeg hjelpe deg?

---

## German (DE)

> 👋 Willkommen! Ich bin der KI-Concierge für **[Unterkunftsname]**.
>
> 🤖 **Bitte beachten Sie:** Ich bin ein KI-gestützter Assistent, kein Mensch. Ich bin hier, um Ihnen bei Fragen zu Ihrem Aufenthalt zu helfen — Check-in, Hausregeln, WLAN, Tipps vor Ort und mehr.
>
> Wenn Sie direkt mit Ihrem Gastgeber sprechen möchten, lassen Sie es mich wissen und ich stelle den Kontakt her.
>
> ℹ️ Ihre Nachrichten werden von KI (Anthropic Claude) verarbeitet und bis zu 90 Tage gespeichert. Weitere Informationen finden Sie in unserer Datenschutzerklärung für Gäste oder kontaktieren Sie hello@heyconcierge.io.
>
> Wie kann ich Ihnen helfen?

---

## Spanish (ES)

> 👋 ¡Bienvenido/a! Soy el conserje de IA de **[Nombre de la propiedad]**.
>
> 🤖 **Aviso importante:** Soy un asistente impulsado por inteligencia artificial, no una persona. Estoy aquí para ayudarte con preguntas sobre tu estancia — check-in, normas de la casa, WiFi, recomendaciones locales y más.
>
> Si necesitas hablar directamente con tu anfitrión, dímelo y os pondré en contacto.
>
> ℹ️ Tus mensajes son procesados por IA (Anthropic Claude) y se almacenan durante un máximo de 90 días. Para más información, consulta nuestro aviso de privacidad para huéspedes o contacta con hello@heyconcierge.io.
>
> ¿En qué puedo ayudarte?

---

## French (FR)

> 👋 Bienvenue ! Je suis le concierge IA de **[Nom de la propriété]**.
>
> 🤖 **Veuillez noter :** Je suis un assistant alimenté par l'intelligence artificielle, pas un être humain. Je suis là pour vous aider avec vos questions concernant votre séjour — arrivée, règles de la maison, WiFi, recommandations locales et plus encore.
>
> Si vous souhaitez parler directement avec votre hôte, faites-le-moi savoir et je vous mettrai en contact.
>
> ℹ️ Vos messages sont traités par IA (Anthropic Claude) et conservés pendant 90 jours maximum. Pour plus d'informations, consultez notre avis de confidentialité pour les hôtes ou contactez hello@heyconcierge.io.
>
> Comment puis-je vous aider ?

---

## Implementation Notes

1. **The AI disclosure is mandatory** — Hosts must not remove the 🤖 paragraph. Customisation of property name, tone, and additional information is encouraged.
2. **First-message delivery** — HeyConcierge should be configured to send this welcome message automatically upon the guest's first message.
3. **Persistent visibility** — If technically feasible, the AI disclosure should also appear in the WhatsApp Business profile description or Telegram bot bio.
4. **Language selection** — Use the language matching the property's primary guest demographic. For international properties, consider using English as default with a note that other languages are supported.

---

**Contact:** hello@heyconcierge.io
