declare module 'pdf-parse' {
  interface PDFData {
    numpages: number
    numrender: number
    info: Record<string, unknown>
    metadata: Record<string, unknown>
    text: string
    version: string
  }

  function pdfParse(buffer: Buffer): Promise<PDFData>
  export default pdfParse
}

declare module 'pdf-parse/lib/pdf-parse.js' {
  import { PDFData } from 'pdf-parse'
  function pdfParse(buffer: Buffer): Promise<PDFData>
  export default pdfParse
}
