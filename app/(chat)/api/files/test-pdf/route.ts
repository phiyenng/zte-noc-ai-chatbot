import { NextResponse } from "next/server";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    console.log('[test-pdf] Testing PDF URL:', url);
    
    // Test PDF loading
    const pdf = await pdfjsLib.getDocument(url).promise;
    console.log('[test-pdf] PDF loaded, pages:', pdf.numPages);
    
    let fullText = "";
    
    // Extract text from first page only for testing
    const page = await pdf.getPage(1);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(" ");
    
    fullText = pageText.trim();
    
    console.log('[test-pdf] Extracted text:', fullText.substring(0, 200));
    
    return NextResponse.json({
      success: true,
      pages: pdf.numPages,
      text: fullText,
      textLength: fullText.length
    });
    
  } catch (error) {
    console.error('[test-pdf] Error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
