import { createWorker } from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import { NextResponse } from "next/server";
import { z } from "zod";

import { auth } from "@/app/(auth)/auth";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const AnalyzeRequestSchema = z.object({
  url: z.string().url(),
  contentType: z.string(),
  fileName: z.string().optional(),
});

// Extract text from image using Tesseract.js
async function extractTextFromImage(imageUrl: string): Promise<string> {
  try {
    const worker = await createWorker();
    
    // Load languages (English + Vietnamese)
    await worker.loadLanguage("eng+vie");
    await worker.initialize("eng+vie");
    
    // Set parameters for better accuracy
    await worker.setParameters({
      tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,!?;:()[]{}\"'`~@#$%^&*+-=<>/\\|_ \n\t",
    });
    
    const { data: { text } } = await worker.recognize(imageUrl);
    await worker.terminate();
    
    return text.trim();
  } catch (error) {
    console.error("Error extracting text from image:", error);
    return "";
  }
}

// Extract text from PDF using PDF.js
async function extractTextFromPDF(pdfUrl: string): Promise<string> {
  try {
    const pdf = await pdfjsLib.getDocument(pdfUrl).promise;
    let fullText = "";
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }
    
    return fullText.trim();
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    return "";
  }
}

// Extract text from text files
async function extractTextFromFile(fileUrl: string): Promise<string> {
  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    const text = await response.text();
    return text.trim();
  } catch (error) {
    console.error("Error extracting text from file:", error);
    return "";
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { url, contentType, fileName } = AnalyzeRequestSchema.parse(body);
    
    console.log('[file-analyze] Request received:', {
      url: url.substring(0, 100) + '...',
      contentType,
      fileName
    });

    let description = "";
    let extractedText = "";

    // Analyze based on content type
    if (contentType.startsWith("image/")) {
      extractedText = await extractTextFromImage(url);
      
      if (extractedText) {
        description = `📷 Image Analysis:\n\nText found in image:\n"${extractedText}"`;
      } else {
        description = `📷 Image uploaded: ${fileName || "image file"}\n\nNo text detected in the image.`;
      }
    } else if (contentType === "application/pdf") {
      console.log('[file-analyze] Processing PDF file...');
      extractedText = await extractTextFromPDF(url);
      console.log('[file-analyze] PDF text extracted:', extractedText.substring(0, 200) + '...');
      
      if (extractedText) {
        // Limit text length to avoid overwhelming the AI
        const truncatedText = extractedText.length > 2000 
          ? extractedText.substring(0, 2000) + "..."
          : extractedText;
        description = `📄 PDF Analysis:\n\nDocument content:\n"${truncatedText}"`;
        console.log('[file-analyze] PDF analysis complete, description length:', description.length);
      } else {
        description = `📄 PDF uploaded: ${fileName || "PDF file"}\n\nNo text content found in the PDF.`;
        console.log('[file-analyze] No text found in PDF');
      }
    } else if (contentType.startsWith("text/")) {
      extractedText = await extractTextFromFile(url);
      
      if (extractedText) {
        const truncatedText = extractedText.length > 2000 
          ? extractedText.substring(0, 2000) + "..."
          : extractedText;
        description = `📝 Text File Analysis:\n\nFile content:\n"${truncatedText}"`;
      } else {
        description = `📝 Text file uploaded: ${fileName || "text file"}\n\nFile appears to be empty.`;
      }
    } else if (contentType.includes("csv") || contentType.includes("excel") || contentType.includes("spreadsheet")) {
      extractedText = await extractTextFromFile(url);
      
      if (extractedText) {
        const truncatedText = extractedText.length > 1000 
          ? extractedText.substring(0, 1000) + "..."
          : extractedText;
        description = `📊 Spreadsheet Analysis:\n\nData content:\n"${truncatedText}"`;
      } else {
        description = `📊 Spreadsheet uploaded: ${fileName || "spreadsheet file"}\n\nNo data content found.`;
      }
    } else {
      description = `📎 File uploaded: ${fileName || "file"} (${contentType})\n\nFile type not supported for automatic analysis.`;
    }

    return NextResponse.json({
      success: true,
      description,
      extractedText: extractedText || null,
      contentType,
      fileName: fileName || "unknown",
    });

  } catch (error) {
    console.error("Error analyzing file:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request format", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to analyze file" },
      { status: 500 }
    );
  }
}
