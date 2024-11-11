'use client'

import { useState, useEffect } from 'react'
import { ListingCard } from '@/components/ListingCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Search, SlidersHorizontal } from 'lucide-react'

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

const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Other']

export default function ListingsPage() {
  const [listings, setListings] = useState<Listing[]>([])
  const [newListing, setNewListing] = useState({ title: '', description: '', price: '', location: '', category: '' })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined)
  const [nextId, setNextId] = useState(1)
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const storedListings = JSON.parse(localStorage.getItem('listings') || '[]')
    setListings(storedListings)
    setNextId(storedListings.length + 1)
  }, [])

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault()
    const id = nextId.toString()
    const createdAt = new Date().toISOString()
    const newListingItem = { ...newListing, id, createdAt, price: parseFloat(newListing.price) }
    const updatedListings = [...listings, newListingItem]
    setListings(updatedListings)
    localStorage.setItem('listings', JSON.stringify(updatedListings))
    setNewListing({ title: '', description: '', price: '', location: '', category: '' })
    setIsDialogOpen(false)
    setNextId(nextId + 1)
  }

  const filteredListings = listings.filter((listing) =>
    (listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedCategory || listing.category === selectedCategory)
  )

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Listings</h1>
      <div className="mb-8 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 items-center">
        <div className="relative w-full sm:w-auto flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Select onValueChange={(value) => setSelectedCategory(value === 'all' ? undefined : value)}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" /> Create New Listing</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Listing</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={newListing.title}
                  onChange={(e) => setNewListing({ ...newListing, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newListing.price}
                  onChange={(e) => setNewListing({ ...newListing, price: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newListing.location}
                  onChange={(e) => setNewListing({ ...newListing, location: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setNewListing({ ...newListing, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Create</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="mb-4 flex justify-end">
        <Tabs value={view} onValueChange={(v: string) => setView(v as 'grid' | 'list')}>
          <TabsList>
            <TabsTrigger value="grid">Grid</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {filteredListings.length === 0 ? (
        <p className="text-center text-muted-foreground">
          No listings found. Create a new listing or adjust your search.
        </p>
      ) : (
        <div className={view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
          {filteredListings.map((listing) => (
            <ListingCard key={listing.id} {...listing} />
          ))}
        </div>
      )}
    </div>
  )
}