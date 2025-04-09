import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
  try {
    console.log('[Upload API] Received upload request');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      console.error('[Upload API] No file provided in the request');
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    console.log(`[Upload API] Processing file upload: ${file.name}, type: ${file.type}, size: ${file.size} bytes`);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const safeFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    const filename = `${uniqueSuffix}-${safeFileName}`;
    
    const publicDir = join(process.cwd(), 'public');
    const uploadDir = join(publicDir, 'uploads');
    const filePath = join(uploadDir, filename);
    
    console.log(`[Upload API] Public directory: ${publicDir}`);
    console.log(`[Upload API] Upload directory: ${uploadDir}`);
    console.log(`[Upload API] File path: ${filePath}`);

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      console.log(`[Upload API] Creating upload directory: ${uploadDir}`);
      try {
        await mkdir(uploadDir, { recursive: true });
        console.log('[Upload API] Upload directory created successfully');
      } catch (dirError) {
        console.error('[Upload API] Failed to create upload directory:', dirError);
        return NextResponse.json(
          { error: 'Server configuration error - unable to create upload directory' },
          { status: 500 }
        );
      }
    }

    try {
      await writeFile(filePath, buffer);
      console.log(`[Upload API] File saved successfully: ${filePath}`);
      
      // Create an absolute URL for the image that doesn't depend on the current route
      const imageUrl = `/uploads/${filename}`;
      console.log(`[Upload API] Image URL generated: ${imageUrl}`);
      
      // Verify the file exists after writing
      if (existsSync(filePath)) {
        console.log(`[Upload API] Verified file exists at: ${filePath}`);
      } else {
        console.error(`[Upload API] File was not found after writing: ${filePath}`);
      }
      
      return NextResponse.json({ 
        success: true,
        url: imageUrl,
        filename: filename,
        originalName: file.name,
        size: file.size,
        type: file.type
      });
    } catch (error) {
      console.error('[Upload API] Error saving file:', error);
      // More detailed error message for debugging
      const errorDetails = error instanceof Error ? 
        { message: error.message, stack: error.stack } : 
        { message: 'Unknown error' };
      
      return NextResponse.json(
        { error: 'Error saving file', details: errorDetails },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Upload API] Error processing upload:', error);
    // More detailed error for debugging
    const errorDetails = error instanceof Error ? 
      { message: error.message, stack: error.stack } : 
      { message: 'Unknown error' };
    
    return NextResponse.json(
      { error: 'Error processing upload', details: errorDetails },
      { status: 500 }
    );
  }
} 