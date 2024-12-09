import axios from 'axios'

import { env } from '@/env'

export async function uploadImageToImgBB(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('image', file)

  try {
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${env.VITE_API_IMGBB_KEY}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response.data.data.display_url
  } catch (error) {
    throw new Error('Falha ao fazer upload da imagem')
  }
}
