'use client'

import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Clock, Tag, MapPin, ArrowLeft, Share2, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Listing {
  id: string
  title: string
  description: string
  price: number
  location: string
  createdAt: string
  category: string
  image?: string
}

export default function ListingDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [listing, setListing] = useState<Listing | null>(null)

  useEffect(() => {
    const storedListings = JSON.parse(localStorage.getItem('listings') || '[]') as Listing[]
    const foundListing = storedListings.find((item) => item.id === id)

    if (foundListing) {
      setListing(foundListing)
    } else {
      setListing({
        id,
        title: 'Listing Not Found',
        description: 'The requested listing could not be found.',
        price: 0,
        location: 'Unknown',
        createdAt: new Date().toISOString(),
        category: 'Unknown',
      })
    }
  }, [id])

  if (!listing) {
    return <p>Loading...</p>
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Link href="/listings" passHref>
        <Button variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
        </Button>
      </Link>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">{listing.title}</CardTitle>
              <Badge variant="secondary">{listing.category}</Badge>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {listing.image && (
            <img src={listing.image} alt={listing.title} className="w-full h-64 object-cover rounded-md" />
          )}
          <p className="text-muted-foreground">{listing.description}</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Badge variant="outline" className="flex items-center">
              <Tag className="w-4 h-4 mr-1" />
              ${listing.price.toFixed(2)}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {listing.location}
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {new Date(listing.createdAt).toLocaleDateString()}
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="default">Contact</Button>
          <Button variant="outline">Save</Button>
        </CardFooter>
      </Card>
    </div>
  )
}