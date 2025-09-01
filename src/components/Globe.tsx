'use client'

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

interface Video {
  id: string
  title: string
  description: string
  platform: string
  url: string
  thumbnail?: string
  tags: string[]
  location: string
  lat: number
  lng: number
  createdAt: string
}

interface GlobeProps {
  videos: Video[]
  onVideoSelect: (video: Video) => void
  selectedVideo?: Video | null
}

export default function Globe({ videos, onVideoSelect, selectedVideo }: GlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.error('Mapbox token is not set')
      return
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

    if (mapContainer.current && !map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/satellite-streets-v12',
        projection: 'globe',
        center: [0, 20],
        zoom: 1.5,
        maxZoom: 10,
        minZoom: 0.5
      })

      // Enable globe view
      map.current.on('style.load', () => {
        if (!map.current) return
        
        map.current.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6
        })
        
        setMapLoaded(true)
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl())
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (!map.current || !mapLoaded || !videos.length) return

    // Clear existing layers and sources safely
    const layersToRemove = ['videos-layer', 'clusters', 'cluster-count']
    layersToRemove.forEach(layerId => {
      if (map.current && map.current.getLayer(layerId)) {
        map.current.removeLayer(layerId)
      }
    })
    
    if (map.current.getSource('videos')) {
      map.current.removeSource('videos')
    }

    // Create GeoJSON data
    const geojsonData = {
      type: 'FeatureCollection' as const,
      features: videos.map((video) => ({
        type: 'Feature' as const,
        properties: {
          id: video.id,
          title: video.title,
          description: video.description,
          platform: video.platform
        },
        geometry: {
          type: 'Point' as const,
          coordinates: [video.lng, video.lat]
        }
      }))
    }

    // Add source
    map.current.addSource('videos', {
      type: 'geojson',
      data: geojsonData,
      cluster: true,
      clusterMaxZoom: 14,
      clusterRadius: 50
    })

    // Add clustered points layer
    map.current.addLayer({
      id: 'clusters',
      type: 'circle',
      source: 'videos',
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          '#51bbd6',
          100,
          '#f1f075',
          750,
          '#f28cb1'
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          20,
          100,
          30,
          750,
          40
        ]
      }
    })

    // Add cluster count labels
    map.current.addLayer({
      id: 'cluster-count',
      type: 'symbol',
      source: 'videos',
      filter: ['has', 'point_count'],
      layout: {
        'text-field': '{point_count_abbreviated}',
        'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
        'text-size': 12
      }
    })

    // Add unclustered points layer
    map.current.addLayer({
      id: 'videos-layer',
      type: 'circle',
      source: 'videos',
      filter: ['!', ['has', 'point_count']],
      paint: {
        'circle-color': [
          'case',
          ['==', ['get', 'platform'], 'youtube'], '#FF0000',
          ['==', ['get', 'platform'], 'tiktok'], '#000000',
          ['==', ['get', 'platform'], 'instagram'], '#E4405F',
          '#4285F4'
        ],
        'circle-radius': 8,
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff'
      }
    })

    // Handle click events on clusters
    map.current.on('click', 'clusters', (e) => {
      if (!map.current || !e.features?.length) return
      
      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      })
      
      if (features.length) {
        const clusterId = features[0].properties?.cluster_id
        const source = map.current.getSource('videos') as mapboxgl.GeoJSONSource
        
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || !map.current || zoom === null || zoom === undefined) return
          
          const coordinates = (features[0].geometry as GeoJSON.Point).coordinates as [number, number]
          map.current.easeTo({
            center: coordinates,
            zoom: zoom
          })
        })
      }
    })

    // Handle click events on individual points
    map.current.on('click', 'videos-layer', (e) => {
      if (!e.features?.length) return
      
      const feature = e.features[0]
      const videoId = feature.properties?.id
      const video = videos.find(v => v.id === videoId)
      
      if (video) {
        onVideoSelect(video)
      }
    })

    // Change cursor on hover
    const handleClusterMouseEnter = () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer'
    }
    
    const handleClusterMouseLeave = () => {
      if (map.current) map.current.getCanvas().style.cursor = ''
    }
    
    const handleVideoMouseEnter = () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer'
    }
    
    const handleVideoMouseLeave = () => {
      if (map.current) map.current.getCanvas().style.cursor = ''
    }

    map.current.on('mouseenter', 'clusters', handleClusterMouseEnter)
    map.current.on('mouseleave', 'clusters', handleClusterMouseLeave)
    map.current.on('mouseenter', 'videos-layer', handleVideoMouseEnter)
    map.current.on('mouseleave', 'videos-layer', handleVideoMouseLeave)

    // Cleanup function to remove event listeners
    return () => {
      if (map.current) {
        map.current.off('mouseenter', 'clusters', handleClusterMouseEnter)
        map.current.off('mouseleave', 'clusters', handleClusterMouseLeave)
        map.current.off('mouseenter', 'videos-layer', handleVideoMouseEnter)
        map.current.off('mouseleave', 'videos-layer', handleVideoMouseLeave)
      }
    }

  }, [videos, mapLoaded, onVideoSelect])

  // Fly to selected video location
  useEffect(() => {
    if (selectedVideo && map.current) {
      map.current.flyTo({
        center: [selectedVideo.lng, selectedVideo.lat],
        zoom: 8,
        duration: 2000
      })
    }
  }, [selectedVideo])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="w-full h-full" />
      {!process.env.NEXT_PUBLIC_MAPBOX_TOKEN && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <p className="text-gray-600 mb-2">Mapbox Token Required</p>
            <p className="text-sm text-gray-500">Please set NEXT_PUBLIC_MAPBOX_TOKEN in your environment</p>
          </div>
        </div>
      )}
    </div>
  )
}