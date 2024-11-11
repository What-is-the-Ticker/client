import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Tag, MapPin, Eye } from 'lucide-react'

interface ListingCardProps {
  id: string
  title: string
  description: string
  price: number
  location: string
  createdAt: string
  category: string
  image?: string
}

export function ListingCard({
  id,
  title,
  description,
  price,
  location,
  createdAt,
  category,
  image,
}: ListingCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [imgSrc, setImgSrc] = useState(image || 'https://picsum.photos/300/200')

  return (
    <Card className="w-full max-w-sm hover:shadow-lg transition-all duration-300 group">
      <CardHeader className="relative p-0 overflow-hidden aspect-video">
        {/* Skeleton Loader */}
        {!isImageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}
        <Image
          src={imgSrc}
          alt={title}
          fill
          className={`object-cover transition-transform duration-300 group-hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          onLoadingComplete={() => setIsImageLoaded(true)}
          onError={() => setImgSrc('/placeholder.svg')}
        />
        <Badge variant="secondary" className="absolute top-2 right-2">
          {category}
        </Badge>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold line-clamp-2 mb-2">{title}</CardTitle>
        <p className="text-muted-foreground line-clamp-2 mb-4 text-sm">{description}</p>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Tag className="w-4 h-4 mr-1" />
            ${price.toFixed(2)}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/listings/${id}`} passHref className="w-full">
          <Button variant="default" className="w-full group-hover:bg-primary/90 transition-colors">
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}