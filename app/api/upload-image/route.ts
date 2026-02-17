import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const maxDuration = 30

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const propertyId = formData.get('propertyId') as string
    const tagsJson = formData.get('tags') as string
    const files = formData.getAll('images') as File[]

    if (!propertyId || !tagsJson || files.length === 0) {
      return NextResponse.json({ error: 'propertyId, tags, and images are required' }, { status: 400 })
    }

    const tags = JSON.parse(tagsJson)
    const uploaded: { url: string; filename: string }[] = []

    for (const file of files) {
      const fileName = `${propertyId}/${Date.now()}_${file.name}`
      const buffer = Buffer.from(await file.arrayBuffer())

      const { error: uploadError } = await supabase.storage
        .from('property-images')
        .upload(fileName, buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName)

      const { error: dbError } = await supabase
        .from('property_images')
        .insert({
          property_id: propertyId,
          url: publicUrl,
          filename: file.name,
          tags,
        })

      if (dbError) throw dbError

      uploaded.push({ url: publicUrl, filename: file.name })
    }

    return NextResponse.json({ success: true, uploaded })
  } catch (error) {
    console.error('Upload image error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload image' },
      { status: 500 }
    )
  }
}
