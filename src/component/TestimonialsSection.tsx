'use client'

import React, { useRef, useState, useEffect } from 'react'
import { gsap } from 'gsap'
import HeroTextLine from './HeroTextAnimation'

interface TestimonialsSectionProps {
    // Add any props if needed in the future
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = () => {
    const sliderRef = useRef<HTMLDivElement>(null)
    const [scrollPosition, setScrollPosition] = useState(0)
    const [currentSlide, setCurrentSlide] = useState(0)
    const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

    const totalSlides = 3

    const getSlideWidth = () => {
        if (!sliderRef.current) return 0
        const slide = sliderRef.current.querySelector('.testimonial-slide') as HTMLElement
        return slide ? slide.offsetWidth : 0
    }

    const scrollLeft = () => {
        if (currentSlide > 0) {
            const newPosition = scrollPosition + getSlideWidth()
            gsap.to(sliderRef.current, {
                x: newPosition,
                duration: 1.2,
                ease: "power3.out"
            })
            setScrollPosition(newPosition)
            setCurrentSlide(currentSlide - 1)
        }
    }

    const scrollRight = () => {
        if (currentSlide < totalSlides - 1) {
            const newPosition = scrollPosition - getSlideWidth()
            gsap.to(sliderRef.current, {
                x: newPosition,
                duration: 1.2,
                ease: "power3.out"
            })
            setScrollPosition(newPosition)
            setCurrentSlide(currentSlide + 1)
        }
    }

    const openVideoPreview = (videoSrc: string) => {
        setSelectedVideo(videoSrc)
        setIsVideoModalOpen(true)
    }

    const closeVideoPreview = () => {
        setIsVideoModalOpen(false)
        setSelectedVideo(null)
    }

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeVideoPreview()
            }
        }

        if (isVideoModalOpen) {
            document.addEventListener('keydown', handleEscKey)
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey)
        }
    }, [isVideoModalOpen])

    return (
        <section className="py-[150px] w-screen overflow-hidden">
            <div className="container flex justify-between items-end m-auto">
                <div className="w-6/12">
                    <HeroTextLine text="Testimonials" className="tq__PPBook__100 block text-3xl" delay={0} index={34} />
                    <h3 className="tq__Instrument_36 mb-[64px]">
                        <HeroTextLine text="Don't worry if you can't find your" className="block" delay={0.2} index={11} />
                        <HeroTextLine text="question in the list given, ask us directly" className="block" delay={0.2} index={12} />
                        <HeroTextLine text="we are here for you." className="block" delay={0.2} index={13} />
                    </h3>
                </div>
                <div className="w-6/12"></div>
            </div>
            <div className="container m-auto relative">
                <div className="testimonial-slider-container overflow-hidden relative" role="region" aria-label="Testimonials slider">
                    <div
                        ref={sliderRef}
                        className="testimonial-slider flex items-start gap-0 will-change-transform active:cursor-grabbing select-none"
                        style={{ transform: `translateX(${scrollPosition}px)` }}
                        role="list"
                    >
                        <div
                            className="testimonial-slide flex items-start min-w-max opacity-90 hover:opacity-100 transition-all duration-500 hover:scale-[1.02] !bg-black"
                            role="listitem"
                            data-slide="0"
                        >
                            {/* First Panel - Video */}
                            <div className="relative group mr-3">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 1 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial1.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial1.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Panel - Video */}
                            <div className="relative group mr-3">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 2 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial2.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial2.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Third Panel - Text Content */}
                            <div className="w-[500px] h-[600px] bg-black flex flex-col justify-end p-[64px]">
                                <div className="mb-8">
                                    <p className="text-white text-sm uppercase tracking-wider mb-4">PREMIUM LINGERIE BRAND</p>
                                    {/* <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black flex items-center justify-center mb-6">
                                        <span className="text-white text-sm uppercase tracking-wider">-DRAG-</span>
                                    </div> */}
                                </div>
                                <div className="mb-8">
                                    <h3 className="text-white text-4xl font-serif mb-6 leading-tight">
                                        "Exceptional Creativity and Professionalism!"
                                    </h3>
                                    <p className="text-white text-lg leading-relaxed opacity-90">
                                        Working with Team Tequila has been an absolutely incredible experience! From
                                        the very first interaction, it was evident that this team is not just about
                                        delivering web design services—they are brand creators who truly elevate your
                                        imagination.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white text-lg uppercase tracking-wider">RAVI KOTWANI</p>
                                    <p className="text-white text-lg uppercase tracking-wider opacity-70">CEO, XTASY</p>
                                </div>
                            </div>

                            {/* Fourth Panel - Video */}
                            <div className="relative group mr-3">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 3 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial3.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial3.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="testimonial-slide flex items-start min-w-max opacity-90 hover:opacity-100 transition-all duration-500 hover:scale-[1.02]"
                            role="listitem"
                            data-slide="1"
                        >
                            {/* First Panel - Video */}
                            <div className="relative group">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 1 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial1.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial1.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Panel - Video */}
                            <div className="relative group mr-3">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 2 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial2.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial2.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Third Panel - Text Content */}
                            <div className="w-[500px] h-[600px] bg-black flex flex-col justify-end p-[64px]">
                                <div className="mb-8">
                                    <p className="text-white text-sm uppercase tracking-wider mb-4">DIGITAL INNOVATION STUDIO</p>
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black flex items-center justify-center mb-6">
                                        <span className="text-white text-sm uppercase tracking-wider">-TECH-</span>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <h3 className="text-white text-4xl font-serif mb-6 leading-tight">
                                        "Outstanding Results and Innovation!"
                                    </h3>
                                    <p className="text-white text-lg leading-relaxed opacity-90">
                                        The level of creativity and attention to detail that Team Tequila brings to
                                        every project is simply remarkable. They transformed our vision into a
                                        stunning digital reality that exceeded all expectations.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white text-lg uppercase tracking-wider">SARAH JOHNSON</p>
                                    <p className="text-white text-lg uppercase tracking-wider opacity-70">Founder, TechFlow</p>
                                </div>
                            </div>

                            {/* Fourth Panel - Video */}
                            <div className="relative group">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 3 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial3.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial3.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="testimonial-slide flex items-start min-w-max opacity-90 hover:opacity-100 transition-all duration-500 hover:scale-[1.02]"
                            role="listitem"
                            data-slide="2"
                        >
                            {/* First Panel - Video */}
                            <div className="relative group">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 1 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial1.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial1.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Second Panel - Video */}
                            <div className="relative group">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 2 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial2.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial2.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Third Panel - Text Content */}
                            <div className="w-[500px] h-[600px] bg-black flex flex-col justify-end p-[64px]">
                                <div className="mb-8">
                                    <p className="text-white text-sm uppercase tracking-wider mb-4">CREATIVE DESIGN AGENCY</p>
                                    <div className="w-16 h-16 bg-gradient-to-br from-green-800 to-black flex items-center justify-center mb-6">
                                        <span className="text-white text-sm uppercase tracking-wider">-ART-</span>
                                    </div>
                                </div>
                                <div className="mb-8">
                                    <h3 className="text-white text-4xl font-serif mb-6 leading-tight">
                                        "Transformative Digital Experience!"
                                    </h3>
                                    <p className="text-white text-lg leading-relaxed opacity-90">
                                        Team Tequila didn't just build a website—they created an immersive digital
                                        journey that perfectly captures our brand essence. The results speak for
                                        themselves.
                                    </p>
                                </div>
                                <div>
                                    <p className="text-white text-lg uppercase tracking-wider">MICHAEL CHEN</p>
                                    <p className="text-white text-lg uppercase tracking-wider opacity-70">Creative Director, StudioX</p>
                                </div>
                            </div>

                            {/* Fourth Panel - Video */}
                            <div className="relative group">
                                <div
                                    className="w-[500px] h-[600px] bg-black cursor-pointer relative overflow-hidden"
                                    onClick={() => {
                                        console.log('Video 3 wrapper clicked!')
                                        openVideoPreview("/videos/testimonial3.mp4")
                                    }}
                                >
                                    <video
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        src="/videos/testimonial3.mp4"
                                    />
                                    {/* Play button overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
                                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute !bottom-[-60px] right-8 flex items-center gap-4 z-10 sm:bottom-12 sm:right-12 animate-fade-in">
                    <button
                        onClick={scrollLeft}
                        className="w-12 h-12  flex items-center justify-center transition-all duration-500 group cursor-pointer"
                        aria-label="Scroll left"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" className="text-white" fill="currentColor">
                            <path d="M6.5 5.999l.707.707L1.914 12H23v1H1.914l5.294 5.295-.707.707L0 12.499l6.5-6.5z" />
                        </svg>
                    </button>
                    <button
                        onClick={scrollRight}
                        className="w-12 h-12  flex items-center justify-center transition-all duration-500 group  cursor-pointer"
                        aria-label="Scroll right"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 25" className="text-white" fill="currentColor">
                            <path d="m17.5 5.999-.707.707 5.293 5.293H1v1h21.086l-5.294 5.295.707.707L24 12.499l-6.5-6.5z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Video Preview Modal */}
            {isVideoModalOpen && selectedVideo && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-red-500/20"
                    onClick={closeVideoPreview}
                >
                    {/* Backdrop with blur effect */}
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

                    {/* Modal content */}
                    <div
                        className="relative z-10 max-w-4xl w-full max-h-[90vh] video-modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={closeVideoPreview}
                            className="absolute -top-12 right-0 w-10 h-10 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 hover:rotate-90 z-20 group"
                            aria-label="Close video preview"
                        >
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Video container with proper aspect ratio */}
                        <div className="relative w-full aspect-video overflow-hidden shadow-2xl bg-black">

                            <video
                                className="w-full h-full object-cover"
                                autoPlay
                                loop
                                playsInline
                                controls
                                src={selectedVideo}
                                onLoadStart={() => {
                                    // Add loading state if needed
                                }}
                            />

                            {/* Video overlay with play indicator */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M8 5v14l11-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Video info overlay */}
                        <div className="mt-4 text-center">
                            <p className="text-white/80 text-sm">Click outside or press ESC to close</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default TestimonialsSection
