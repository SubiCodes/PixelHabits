import React, { useState } from 'react'
import Image from 'next/image';

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel"
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
    React.useEffect(() => {
        if (!api) {
            return
        }
        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    const aspectClass = "aspect-[9/16] w-full h-auto flex items-center justify-center";

    const renderMedia = (item: MediaType, index: number) => {
        let mediaContent = null;
        if (typeof item === "string") {
            const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(item);
            const isVideo = /\.(mp4|webm|ogg)$/i.test(item);
            if (isImage) {
                mediaContent = (
                    <div className={`relative w-full h-full ${aspectClass}`}>
                        <Image
                            src={item}
                            alt={`media-${index}`}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 400px) 100vw, 400px"
                            priority
                        />
                    </div>
                );
            } else if (isVideo) {
                mediaContent = (
                    <div className={aspectClass}>
                        <video
                            src={item}
                            controls
                            className="w-full h-full object-cover rounded"
                            style={{ background: 'black' }}
                        />
                    </div>
                );
            } else {
                mediaContent = <a href={item} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Open File</a>;
            }
        } else if (item instanceof File) {
            const url = URL.createObjectURL(item);
            const isImage = item.type.startsWith("image/");
            const isVideo = item.type.startsWith("video/");
            if (isImage) {
                mediaContent = (
                    <div className={`relative w-full h-full ${aspectClass}`}>
                        <Image
                            src={url}
                            alt={item.name}
                            fill
                            style={{ objectFit: 'cover' }}
                            sizes="(max-width: 400px) 100vw, 400px"
                            priority
                        />
                    </div>
                );
            } else if (isVideo) {
                mediaContent = (
                    <div className={aspectClass}>
                        <video
                            src={url}
                            controls
                            className="w-full h-full object-cover rounded"
                            style={{ background: 'black' }}
                        />
                    </div>
                );
            } else {
                mediaContent = <span>{item.name}</span>;
            }
        }
        return (
            <div className="relative w-full h-full">
                {mediaContent}
                {onDeleteMedia && (
                    <button
                        type="button"
                        onClick={() => onDeleteMedia(index)}
                        className="absolute top-2 right-2 z-10 bg-black/60 text-white rounded-full p-2 hover:bg-red-600 transition"
                        aria-label="Delete media"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className='flex-1 flex items-center justify-center relative'>
            <Carousel className="w-full max-w-xs" setApi={setApi}>
                <CarouselContent>
                    {media.length === 0 ? (
                        <CarouselItem>
                            <div className={`flex items-center justify-center p-0 ${aspectClass}`}>
                                <span className="text-4xl font-semibold text-gray-400">No Media</span>
                            </div>
                        </CarouselItem>
                    ) : (
                        media.map((item, index) => (
                            <CarouselItem key={index}>
                                <div className={`flex items-center justify-center p-0 ${aspectClass}`}>
                                    {renderMedia(item, index)}
                                </div>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
            </Carousel>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-muted-foreground py-1 px-3 rounded bg-black/60 text-white text-sm">
                Slide {current} of {count}
            </div>
        </div>
    );
}

export default CarouselMediaDisplay
