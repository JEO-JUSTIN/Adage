import { supabase } from '../supabase';

/**
 * Converts a browser File object to a Base64 string.
 * @param {File} file 
 * @returns {Promise<string>}
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
  });
};

/**
 * Uploads a payment screenshot to Google Drive via Google Apps Script Web App Endpoint.
 * If Google Drive URL is not configured or fails, falls back gracefully to Supabase Storage or Base64 data.
 * 
 * @param {File} file - The uploaded screenshot image file
 * @param {string} registrationId - Unique ID or reference string for file naming
 * @returns {Promise<string>} - Returns public Google Drive view link or fallback storage URL
 */
export const uploadScreenshotToGoogleDrive = async (file, registrationId = "") => {
  if (!file) {
    throw new Error("No file provided for upload.");
  }

  // Validate image file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files (PNG, JPG, JPEG, WEBP) are allowed.");
  }

  // File size limit (max 10MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Image file size must be less than 10MB.");
  }

  const base64Data = await fileToBase64(file);
  const cleanId = registrationId ? registrationId.trim() : "REG_" + Date.now();
  const ext = file.name.split('.').pop() || 'png';
  const filename = `UPI_${cleanId}_${Date.now()}.${ext}`;

  const driveEndpoint = import.meta.env.VITE_GOOGLE_DRIVE_WEBAPP_URL;

  // 1. Try Google Apps Script Endpoint if provided
  if (driveEndpoint && driveEndpoint.startsWith("http")) {
    try {
      const response = await fetch(driveEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "text/plain;charset=utf-8", // Uses text/plain to prevent CORS preflight issues with Google Apps Script
        },
        body: JSON.stringify({
          filename: filename,
          mimeType: file.type || "image/png",
          base64Data: base64Data
        })
      });

      if (!response.ok) {
        throw new Error(`Google Drive endpoint HTTP error ${response.status}`);
      }

      const resData = await response.json();
      if (resData.status === "success" && resData.driveUrl) {
        return resData.driveUrl;
      } else if (resData.message) {
        console.warn("Google Drive upload warning:", resData.message);
      }
    } catch (err) {
      console.warn("Google Apps Script upload failed, falling back to Supabase Storage:", err);
    }
  }

  // 2. Fallback: Try Supabase Storage bucket 'payment-screenshots'
  try {
    const filePath = `screenshots/${filename}`;
    const { data, error } = await supabase.storage
      .from('payment-screenshots')
      .upload(filePath, file, { upsert: true });

    if (!error && data) {
      const { data: publicUrlData } = supabase.storage
        .from('payment-screenshots')
        .getPublicUrl(filePath);
      if (publicUrlData?.publicUrl) {
        return publicUrlData.publicUrl;
      }
    }
  } catch (storageErr) {
    console.warn("Supabase storage upload fallback failed:", storageErr);
  }

  // 3. Last fallback: return the base64 data URL directly so submission never fails
  return base64Data;
};
