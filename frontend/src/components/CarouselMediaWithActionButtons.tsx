import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageCircle } from "lucide-react"

type MediaType = string | File;

interface CarouselMediaForDisplayProps {
    media: MediaType[];
    posterName: string;
    posterAvatar: string;
    postDate: string;
    caption: string;
    onLike?: () => void;
    onComment?: () => void;
    isLiked?: boolean;
}

function CarouselMediaWithActionButtons({ 
    media, 
    posterName, 
    posterAvatar, 
    postDate, 
    caption,
    onLike,
    onComment,
    isLiked = false
}: CarouselMediaForDisplayProps) {

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
                    <img src={item} alt={`media-${index}`} className="max-w-full max-h-full object-contain" />
                );
            } else if (isVideo) {
                return (
                    <video 
                        src={item} 
                        className="max-w-full max-h-full object-contain cursor-pointer" 
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
                    <img src={url} alt={item.name} className="max-w-full max-h-full object-contain" />
                );
            } else if (isVideo) {
                return (
                    <video 
                        src={url} 
                        className="max-w-full max-h-full object-contain cursor-pointer" 
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
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <span className="text-2xl font-semibold text-gray-400">No Media</span>
            </div>
        );
    }

    return (
        <div className='w-full h-full relative'>
            <Carousel className="w-full h-full flex items-center justify-center" setApi={setApi}>
                <CarouselContent className="h-full">
                    {Array.from({ length: media.length }).map((_, index) => (
                        <CarouselItem key={index} className="flex items-center justify-center">
                            <div className="w-full h-full flex flex-1 items-center justify-center ">
                                {renderMedia(media[index], index)}
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            
            {/* Slide indicator */}
            {count > 1 && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm z-30">
                    {current} / {count}
                </div>
            )}

            {/* Control buttons on the right - overlaying media */}
            <div className="absolute right-4 bottom-4 flex flex-col-reverse gap-4 z-20">
                <Avatar className="h-12 w-12 border-2 border-white shadow-lg cursor-pointer">
                    <AvatarImage src={posterAvatar} alt={posterName} />
                    <AvatarFallback>{posterName.charAt(0)}</AvatarFallback>
                </Avatar>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg"
                    onClick={onComment}
                >
                    <MessageCircle className="h-6 w-6 text-white" />
                </Button>
                 <Button
                    variant="ghost"
                    size="icon"
                    className={`h-12 w-12 rounded-full backdrop-blur-sm shadow-lg transition-colors ${
                        isLiked 
                            ? 'bg-red-500/30 hover:bg-red-500/40' 
                            : 'bg-white/20 hover:bg-white/30'
                    }`}
                    onClick={onLike}
                >
                    <Heart className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </Button>
            </div>

            {/* Info on the bottom left - overlaying media */}
            <div className="absolute bottom-0 left-0 right-0 p-4 pr-20 bg-gradient-to-t from-black/60 via-black/40 to-transparent z-10">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white">{posterName}</span>
                        <span className="text-xs text-white/80">• {postDate}</span>
                    </div>
                    <p className="text-sm text-white/90 line-clamp-2">{caption}</p>
                </div>
            </div>
        </div>
    )
}

export default CarouselMediaWithActionButtons
