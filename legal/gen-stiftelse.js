const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, HeadingLevel } = require('docx');
const fs = require('fs');

const doc = new Document({
  sections: [{
    properties: { page: { margin: { top: 1200, bottom: 1200, left: 1200, right: 1200 } } },
    children: [
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 400 }, children: [
        new TextRun({ text: "STIFTELSESDOKUMENT", bold: true, size: 36, font: "Calibri" })
      ]}),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [
        new TextRun({ text: "HeyConcierge AS", bold: true, size: 28, font: "Calibri" })
      ]}),

      // § 1
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 }, children: [
        new TextRun({ text: "§ 1 Stiftere", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Følgende stiftere har besluttet å stifte aksjeselskapet HeyConcierge AS:", font: "Calibri", size: 22 })
      ]}),

      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Stifter", bold: true, size: 20 })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Fødselsdato", bold: true, size: 20 })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Antall aksjer", bold: true, size: 20 })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Beløp (NOK)", bold: true, size: 20 })] })] }),
          ]}),
          ...[ 
            ["Jacob Nørby", "___________", "333", "10 000"],
            ["Erik Austheim", "___________", "333", "10 000"],
            ["Lars Jakobsen", "___________", "334", "10 000"],
          ].map(r => new TableRow({ children: r.map(c => 
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c, size: 20 })] })] })
          )})),
        ]
      }),
      new Paragraph({ spacing: { before: 200, after: 400 }, children: [
        new TextRun({ text: "Totalt: 1 000 aksjer à NOK 30, samlet aksjekapital NOK 30 000", bold: true, size: 22, font: "Calibri" })
      ]}),

      // § 2
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 }, children: [
        new TextRun({ text: "§ 2 Vedtekter", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun({ text: "Selskapets vedtekter er som følger:", size: 22 })
      ]}),

      ...[
        ["§ 2-1 Foretaksnavn", "Selskapets navn er HeyConcierge AS."],
        ["§ 2-2 Forretningskommune", "Selskapets forretningskontor er i Tromsø kommune."],
        ["§ 2-3 Virksomhet", "Selskapet skal drive med utvikling og salg av AI-baserte konsiertjenester, programvare og relaterte tjenester, samt alt som naturlig hører inn under dette, herunder deltakelse i andre selskaper."],
        ["§ 2-4 Aksjekapital", "Aksjekapitalen er NOK 30 000, fordelt på 1 000 aksjer, hver pålydende NOK 30."],
        ["§ 2-5 Styre", "Selskapets styre skal bestå av 1–3 medlemmer etter generalforsamlingens nærmere beslutning."],
        ["§ 2-6 Signatur", "Selskapets firma tegnes av styrets leder alene, eller av to styremedlemmer i fellesskap."],
        ["§ 2-7 Overdragelse av aksjer", "Ved enhver overdragelse av aksjer har de øvrige aksjonærer forkjøpsrett. Forkjøpsretten gjelder i 30 dager fra varsel om overdragelse er gitt. Styrets samtykke kreves ved overdragelse av aksjer."],
        ["§ 2-8 Generalforsamling", "Den ordinære generalforsamlingen skal behandle og avgjøre: godkjennelse av årsregnskapet og eventuell årsberetning, fastsettelse av resultatregnskap og balanse, og andre saker som etter loven hører under generalforsamlingen."],
      ].flatMap(([title, body]) => [
        new Paragraph({ spacing: { before: 200, after: 50 }, children: [
          new TextRun({ text: title, bold: true, size: 22, font: "Calibri" })
        ]}),
        new Paragraph({ spacing: { after: 100 }, children: [
          new TextRun({ text: body, size: 22, font: "Calibri" })
        ]}),
      ]),

      // § 3
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 }, children: [
        new TextRun({ text: "§ 3 Styrevalg", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun({ text: "Følgende er valgt til selskapets styre:", size: 22 })
      ]}),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [
          new TableRow({ children: [
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Rolle", bold: true, size: 20 })] })] }),
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Navn", bold: true, size: 20 })] })] }),
          ]}),
          ...[ 
            ["Styreleder", "Lars Jakobsen"],
            ["Styremedlem", "Jacob Nørby"],
            ["Styremedlem", "Erik Austheim"],
          ].map(r => new TableRow({ children: r.map(c => 
            new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: c, size: 20 })] })] })
          )})),
        ]
      }),

      // § 4
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 }, children: [
        new TextRun({ text: "§ 4 Daglig leder", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Jacob Nørby er valgt som daglig leder.", size: 22 })
      ]}),

      // § 5
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 }, children: [
        new TextRun({ text: "§ 5 Revisor", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Selskapet har ikke revisor (jf. aksjeloven § 7-6 — fritak for små selskaper).", size: 22 })
      ]}),

      // § 6
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 }, children: [
        new TextRun({ text: "§ 6 Innbetaling av aksjekapital", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun({ text: "Aksjekapitalen skal innbetales i penger til selskapets bankkonto innen 14 dager etter stiftelse.", size: 22 })
      ]}),
      new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: "Jacob Nørby: NOK 10 000", size: 22 })] }),
      new Paragraph({ spacing: { after: 50 }, children: [new TextRun({ text: "Erik Austheim: NOK 10 000", size: 22 })] }),
      new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "Lars Jakobsen: NOK 10 000", size: 22 })] }),

      // § 7
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 400, after: 200 }, children: [
        new TextRun({ text: "§ 7 Stiftelsesutgifter", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 200 }, children: [
        new TextRun({ text: "Stiftelsesutgiftene dekkes av selskapet og er estimert til NOK 6 797 (Brønnøysundregistrene).", size: 22 })
      ]}),

      // § 8
      new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 600, after: 300 }, children: [
        new TextRun({ text: "§ 8 Underskrifter", bold: true })
      ]}),
      new Paragraph({ spacing: { after: 100 }, children: [
        new TextRun({ text: "Dato: ________________________________", size: 22 })
      ]}),
      new Paragraph({ spacing: { before: 400, after: 50 }, children: [
        new TextRun({ text: "________________________________", size: 22 })
      ]}),
      new Paragraph({ spacing: { after: 300 }, children: [
        new TextRun({ text: "Jacob Nørby", size: 22 })
      ]}),
      new Paragraph({ spacing: { after: 50 }, children: [
        new TextRun({ text: "________________________________", size: 22 })
      ]}),
      new Paragraph({ spacing: { after: 300 }, children: [
        new TextRun({ text: "Erik Austheim", size: 22 })
      ]}),
      new Paragraph({ spacing: { after: 50 }, children: [
        new TextRun({ text: "________________________________", size: 22 })
      ]}),
      new Paragraph({ spacing: { after: 300 }, children: [
        new TextRun({ text: "Lars Jakobsen", size: 22 })
      ]}),
    ]
  }]
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('/Users/jacobnorby/.openclaw/workspace/heyconcierge-saas/legal/stiftelsesdokument-heyconcierge.docx', buf);
  console.log('DONE');
});
