import { Camera, Trash2 } from 'lucide-react'
import type React from 'react'
import { useRef, useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

interface SelectAvatarProps {
  onImageSelect?: (file: File | null) => void
}

const SelectAvatar: React.FC<SelectAvatarProps> = ({ onImageSelect }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        onImageSelect?.(file)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    onImageSelect?.(null)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={selectedImage || undefined}
          alt="User profile"
          className="object-cover"
        />
        <AvatarFallback className="bg-gray-200 text-gray-600">
          <Camera className="h-12 w-12" />
        </AvatarFallback>
      </Avatar>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="relative overflow-hidden"
        >
          Selecionar Foto
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
        </Button>

        {selectedImage && (
          <Button variant="destructive" size="sm" onClick={handleRemoveImage}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}

export default SelectAvatar
