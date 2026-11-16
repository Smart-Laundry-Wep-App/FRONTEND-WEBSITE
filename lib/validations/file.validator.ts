/**
 * Keamanan & Validasi File (Poin 20 PBL)
 * Membatasi ukuran maksimum dan jenis berkas (MIME type) sebelum diunggah
 * serta menolak berkas yang tidak valid.
 */

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

// Konfigurasi batasan file
export const FILE_UPLOAD_CONFIG = {
  maxSizeBytes: 2 * 1024 * 1024, // Maksimal 2 MB
  maxSizeLabel: "2 MB",
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
  allowedExtensions: [".jpg", ".jpeg", ".png", ".webp"],
};

/**
 * Memvalidasi berkas file sebelum diunggah ke cloud storage
 */
export function validateUploadedFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: "File tidak boleh kosong." };
  }

  // 1. Validasi Ukuran File (Max Size)
  if (file.size > FILE_UPLOAD_CONFIG.maxSizeBytes) {
    return {
      valid: false,
      error: `Ukuran berkas (${(file.size / (1024 * 1024)).toFixed(2)} MB) melebihi batas maksimum ${FILE_UPLOAD_CONFIG.maxSizeLabel}.`,
    };
  }

  // 2. Validasi Jenis Berkas (MIME Type)
  if (!FILE_UPLOAD_CONFIG.allowedMimeTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Format berkas tidak diizinkan (${file.type || "tidak diketahui"}). Hanya format JPG, PNG, dan WebP yang didukung.`,
    };
  }

  // 3. Validasi Ekstensi Berkas
  const fileName = file.name.toLowerCase();
  const hasValidExtension = FILE_UPLOAD_CONFIG.allowedExtensions.some((ext) =>
    fileName.endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      valid: false,
      error: "Ekstensi berkas tidak valid atau tidak cocok dengan format gambar resmi.",
    };
  }

  return { valid: true };
}
