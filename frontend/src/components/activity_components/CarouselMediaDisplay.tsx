
import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from '../ui/button';
import { X } from 'lucide-react';

type MediaType = string | File;

interface CarouselMediaDisplayProps {
    media: MediaType[];
    onDeleteMedia?: (index: number) => void;
}

function CarouselMediaDisplay({ media, onDeleteMedia }: CarouselMediaDisplayProps) {

    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
        const video = e.currentTarget;
        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const renderMedia = (item: MediaType, index: number) => {
        if (typeof item === "string") {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(item);
            const isVideo = /\.(mp4|webm|ogg)$/i.test(item);
            if (isImage) {
                return (
                    <img src={item} alt={`media-${index}`} className="w-full h-full object-contain bg-black" />
                );
            } else if (isVideo) {
                return (
                    <video 
                        src={item} 
                        className="w-full h-full object-contain bg-black cursor-pointer" 
                        onClick={handleVideoClick}
                        playsInline
                        loop
                    />
                );
            }
        } else if (item instanceof File) {
            const url = URL.createObjectURL(item);
            const isImage = item.type.startsWith("image/");
            const isVideo = item.type.startsWith("video/");
            if (isImage) {
                return (
                    <img src={url} alt={item.name} className="w-full h-full object-contain bg-black" />
                );
            } else if (isVideo) {
                return (
                    <video 
                        src={url} 
                        className="w-full h-full object-contain bg-black cursor-pointer" 
                        onClick={handleVideoClick}
                        playsInline
                        loop
                    />
                );
            }
        }
    }


    React.useEffect(() => {
        if (!api) {
            return
        }
        
        const updateCarouselState = () => {
            setCount(api.scrollSnapList().length)
            setCurrent(api.selectedScrollSnap() + 1)
        }
        
        updateCarouselState()
        api.on("select", updateCarouselState)
        
        return () => {
            api.off("select", updateCarouselState)
        }
    }, [api])

    React.useEffect(() => {
        if (api) {
            api.reInit()
            setCount(api.scrollSnapList().length)
            setCurrent(api.selectedScrollSnap() + 1)
        } else {
            setCount(media.length)
            setCurrent(media.length > 0 ? 1 : 0)
        }
    }, [media.length, api])

    if (media.length === 0) {
        return (
            <div className="w-full h-[300px] md:h-[500px] flex items-center justify-center bg-gray-50">
                <span className="text-2xl md:text-4xl font-semibold text-gray-400">No Media</span>
            </div>
        );
    }

    return (
        <div className='w-full h-full flex items-center justify-center'>
            <div className="relative w-full max-w-xs">
                <Carousel className="w-full" setApi={setApi}>
                    <CarouselContent>
                        {Array.from({ length: media.length }).map((_, index) => (
                            <CarouselItem key={index}>
                                <div className="p-1 aspect-9/16 relative">
                                    {renderMedia(media[index], index)}
                                    {onDeleteMedia && (
                                        <Button 
                                            variant="destructive" 
                                            size="sm" 
                                            className="absolute top-3 right-3 z-10 rounded-full p-1" 
                                            onClick={() => onDeleteMedia(index)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                    {current} / {count}
                </div>
            </div>
        </div>
    )
}

export default CarouselMediaDisplay
