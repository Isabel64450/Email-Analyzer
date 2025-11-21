import { EmailMessage } from "@domainModels/emailAnalyzer/AnalyzedEmail";
import { EmailHeader } from "@domainModels/emailAnalyzer/EmailHeader";
import { EmailBody } from "@domainModels/emailAnalyzer/EmailBody";
import { EmailMetadata } from "@domainModels/emailAnalyzer/EmailMetadata";
import { EmailAttachment } from "@domainModels/emailAnalyzer/EmailAttachement";

// petite fonction utilitaire pour créer rapidement un EmailMessage
function makeEmailMessage(raw: any): EmailMessage {
  const headers = (raw.internetMessageHeaders || []).map(
    (h: any) => new EmailHeader(h.name, h.value)
  );

  let content = raw.body?.content || "";
  let contentType = raw.body?.contentType || "text";
  
  const body = new EmailBody(contentType, content);
  const attachments = (raw.attachments || []).map(
    (a: any) => new EmailAttachment(a.filename, a.contentType)
  );

  const metadata = new EmailMetadata(
    raw.id,
    raw.subject || "",
    raw.from?.emailAddress?.address || "",
    new Date(raw.sentDateTime || Date.now()),
    new Date(raw.receivedDateTime || Date.now()),
    raw.conversationId,
    raw.webLink
  );

  return new EmailMessage(headers, body, metadata, attachments);
}

// tes données "raw" (copiées depuis ton exemple)
const rawEmails = [
  {
    id: "email-legit-1",
    description: "Email interne légitime (message de référence)",
    subject: "Rapport mensuel — Finance",
    body: {
      contentType: "text",
      content:
        "Bonjour Bob,\n\nVoici le rapport financier mensuel.\n\nCordialement,\nAlice Martin",
    },
    from: { name: "Alice Martin", emailAddress: { address: "alice@company.com" } },
    toRecipients: [{ emailAddress: { address: "bob@example.com" } }],
    attachments: [
      {
        filename: "rapport_financier.docx",
        contentType:
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      },
    ],
    internetMessageHeaders: [
      { name: "From", value: "Alice Martin <alice@company.com>" },
      { name: "To", value: "bob@example.com" },
      { name: "Message-ID", value: "<local-legit-1@test>" },
    ],
    conversationId: "conv-001",
    webLink:
      "https://outlook.office.com/mail/deeplink/compose?mid=local-legit-1",
    sentDateTime: "2025-10-25T08:00:00Z",
    receivedDateTime: "2025-10-25T08:00:02Z",
  },
  {
  id: "email-legit-2",
  description: "Email interne légitime — suite du fil",
  subject: "RE: Rapport mensuel — Finance",
  body: { contentType: "text", content: "Merci pour le rapport, Bob. Quelques remarques..." },
  from: { name: "Alice Martin", emailAddress: { address: "alice@company.com" } },
  toRecipients: [{ emailAddress: { address: "bob@example.com" } }],
  attachments: [],
  internetMessageHeaders: [
    { name: "From", value: "Alice Martin <alice@company.com>" },
    { name: "To", value: "bob@example.com" },
    { name: "Message-ID", value: "<local-legit-2@test>" },
    { name: "In-Reply-To", value: "<local-legit-1@test>" },
  ],
  conversationId: "conv-001",
  webLink: "",
  sentDateTime: "2025-10-25T09:00:00Z",
  receivedDateTime: "2025-10-25T09:00:01Z",
},

{
  id: "email-legit-3",
  description: "Email interne légitime — dernier message du fil",
  subject: "RE: Rapport mensuel — Finance",
  body: { contentType: "text", content: "Bob, noté. Merci pour la mise à jour." },
  from: { name: "Alice Martin", emailAddress: { address: "alice@company.com" } },
  toRecipients: [{ emailAddress: { address: "bob@example.com" } }],
  attachments: [],
  internetMessageHeaders: [
    { name: "From", value: "Alice Martin <alice@company.com>" },
    { name: "To", value: "bob@example.com" },
    { name: "Message-ID", value: "<local-legit-3@test>" },
    { name: "In-Reply-To", value: "<local-legit-2@test>" },
  ],
  conversationId: "conv-001",
  webLink: "",
  sentDateTime: "2025-10-25T10:00:00Z",
  receivedDateTime: "2025-10-25T10:00:01Z",
},

  {
    id: "email-phish-1",
    description: "Phishing simulé — déclenche toutes les analyses",
    subject: "🚨 URGENT — Vérifiez votre compte immédiatement !!!",
    body: {
      contentType: "text",
      content:
        "Bonjour Bob, Nous avons détecté une activité suspecte sur votre compte. Veuillez vérifier immédiatement pour éviter la suspension. 🔗 https://secure.company.com/login Merci, Support - Acme Corp",
    },
    from: { name: "Support Acme", emailAddress: { address: "phishing@local-test.com" } },
    replyTo: { emailAddress: { address: "fake-support@local-test.com" } },
    toRecipients: [{ emailAddress: { address: "bob@example.com" } }],
    attachments: [
      {
        filename: "facture_URGENTE.exe",
        contentType: "application/octet-stream",
      },
    ],
    internetMessageHeaders: [
      { name: "From", value: "Support Acme <phishing@local-test.com>" },
      { name: "Reply-To", value: "fake-support@local-test.com" },
      { name: "To", value: "bob@example.com" },
      { name: "Message-ID", value: "<local-phish-1@test>" },
    ],
    conversationId: "conv-002",
    webLink: "https://outlook.office.com/mail/deeplink/compose?mid=local-phish-1",
    sentDateTime: "2025-10-28T09:00:00Z",
    receivedDateTime: "2025-10-28T09:00:01Z",
  },

  {
    id: "email-full-test",
    description: "Email pour tester tous les usecases",
    subject: "🚨 ACTION IMMEDIATE REQUISE – Compte suspendu !",
    body: {
      contentType: "html",
      content: `
        <p>Bonjour,</p>
        <p>Votre compte a été compromis. <strong>Veuillez cliquer ici immédiatement</strong> pour éviter la suspension :</p>
        <p><a href="http://malicious-link.test/login">http://malicious-link.test/login</a></p>
        <p>Merci, <span style="display:none">hacked</span> Support Security Team</p>
      `,
    },
    from: { name: "IT Support", emailAddress: { address: "spoof@fake-domain.test" } },
    replyTo: { emailAddress: { address: "malicious-reply@test.com" } },
    toRecipients: [
      { emailAddress: { address: "bob@example.com" } },
      { emailAddress: { address: "alice@example.com" } },
    ],
    ccRecipients: [
      { emailAddress: { address: "charlie@example.com" } },
    ],
    attachments: [
      { filename: "facture_suspicious.exe", contentType: "application/octet-stream" },
      { filename: "document_malicious.zip", contentType: "application/zip" },
    ],
    internetMessageHeaders: [
      { name: "From", value: "IT Support <spoof@fake-domain.test>" },
      { name: "Reply-To", value: "malicious-reply@test.com" },
      { name: "To", value: "bob@example.com, alice@example.com" },
      { name: "Cc", value: "charlie@example.com" },
      { name: "Message-ID", value: "<full-test-1@test>" },
      { name: "In-Reply-To", value: "<non-existent@test>" },
      { name: "References", value: "<non-existent@test>" },
      { name: "Spoofed-DisplayName", value: "IT Support" },
    ],
    conversationId: "conv-full-test",
    webLink: "https://outlook.office.com/mail/deeplink/compose?mid=full-test-1",
    sentDateTime: "2025-10-30T12:00:00Z",
    receivedDateTime: "2025-10-30T12:00:01Z",
  },

  // ✅ Email pour tester ThreadHijack en local
  {
  id: "email-replitest",
  description: "Test complet pour tous les usecases",
  subject: "URGENT : Rapport mensuel — Finance",
  body: {
    contentType: "html",
    content: `
      <html>
        <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        </head>
        <body>
          <p>Bonjour, veuillez vérifier :</p>
          <p>Raccourci : <a href="https://bit.ly/3example">bit.ly/3example</a></p>
          <p>Login non sécurisé : <a href="http://insecure.example.com/login">http://insecure.example.com/login</a></p>
          <p>Attention : <a href="https://xn--80ak6aa92e.com/login">https://рaypal.com</a></p>
          <p>Correct : <a href="https://example.com">https://example.com</a></p>
          <p>Fautes visibles : Bonjur Bob, reponsse au raport mensuel.</p>
        </body>
      </html>
    `
  },
  from: { name: "CEO de MonEntreprise", emailAddress: { address: "ceo.alert@evil-domain.net" } },
  replyTo: { emailAddress: { address: "malicious-reply@test.com" } }, // déclenche replyToMismatch
  toRecipients: [{ emailAddress: { address: "bob@example.com" } }],
  attachments: [
    { filename: "facture_suspicious.fakeexe", contentType: "application/octet-stream" }, // déclenche attachementRisk
    { filename: "document_malicious.zip", contentType: "application/zip" }            // déclenche attachementRisk
  ],
  internetMessageHeaders: [
    { name: "From", value: "CEO de MonEntreprise <ceo.alert@evil-domain.net>"  },
    { name: "Reply-To", value: "malicious-reply@test.com" },
    { name: "To", value: "bob@example.com" },
    { name: "In-Reply-To", value: "<local-legit-1@test>" },
    { name: "Message-ID", value: "<email-replitest@test>" },
  ],
  conversationId: "conv-001", // même fil que email-legit-1
  webLink: "",
  sentDateTime: "2025-11-03T10:00:00Z",
  receivedDateTime: "2025-11-03T10:00:01Z",
}
];



// on exporte directement les EmailMessage construits :
export const emails: EmailMessage[] = rawEmails.map(makeEmailMessage);