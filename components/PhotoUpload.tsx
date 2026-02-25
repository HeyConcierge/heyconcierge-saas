'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface PhotoUploadProps {
  onPhotosUploaded: (urls: string[]) => void
  existingPhotos?: string[]
  maxPhotos?: number
}

export default function PhotoUpload({ onPhotosUploaded, existingPhotos = [], maxPhotos = 10 }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string[]>(existingPhotos)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const compressImage = async (file: File): Promise<File> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          const MAX_WIDTH = 1920
          const MAX_HEIGHT = 1920
          
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = height * (MAX_WIDTH / width)
              width = MAX_WIDTH
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = width * (MAX_HEIGHT / height)
              height = MAX_HEIGHT
            }
          }
          
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')!
          ctx.drawImage(img, 0, 0, width, height)
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              }))
            }
          }, 'image/jpeg', 0.85)
        }
        img.src = e.target?.result as string
      }
      reader.readAsDataURL(file)
    })
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return

    if (preview.length + files.length > maxPhotos) {
      setError(`Maximum ${maxPhotos} photos allowed`)
      return
    }

    setError(null)
    setUploading(true)
    setProgress(0)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('You must be logged in to upload photos')
      }

      const uploadedUrls: string[] = []
      const progressPerFile = 100 / files.length

      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        
        // Compress image
        const compressed = await compressImage(file)
        
        if (compressed.size > 2 * 1024 * 1024) {
          console.warn(`Skipping ${file.name} - still too large after compression`)
          continue
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop()
        const fileName = `${user.id}/${Date.now()}-${i}.${fileExt}`

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from('user-photos')
          .upload(fileName, compressed, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('user-photos')
          .getPublicUrl(fileName)

        uploadedUrls.push(publicUrl)
        setProgress(prev => Math.min(prev + progressPerFile, 100))
      }

      const newPhotos = [...preview, ...uploadedUrls]
      setPreview(newPhotos)
      onPhotosUploaded(newPhotos)
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload photos')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  const removePhoto = (index: number) => {
    const newPhotos = preview.filter((_, i) => i !== index)
    setPreview(newPhotos)
    onPhotosUploaded(newPhotos)
  }

  return (
    <div>
      {/* Upload Button */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="photo-upload-input"
      />
      
      <label
        htmlFor="photo-upload-input"
        className={`block w-full py-4 px-6 bg-primary text-white text-center rounded-xl cursor-pointer hover:bg-dark transition text-base font-bold ${
          uploading || preview.length >= maxPhotos ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        📷 {preview.length > 0 ? 'Add More Photos' : 'Take Photo / Choose from Gallery'}
      </label>

      {/* Progress Bar */}
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted mt-2 text-center">
            Uploading... {Math.round(progress)}%
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Photo Grid */}
      {preview.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {preview.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden shadow-md group">
              <img
                src={url}
                alt={`Photo ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => removePhoto(i)}
                className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-sm font-bold"
                type="button"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-muted mt-3 text-center">
        {preview.length}/{maxPhotos} photos • Images auto-compressed to save space
      </p>
    </div>
  )
}
