// ScrollShaderSlider.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// HTML content components for each slide - EXACTLY your original layout
const SlideContent = ({ slideIndex }: { slideIndex: number }) => {
  const slideContents = [
    // Slide 1
    <div key={0} className="w-full flex justify-between items-start gap-[32px] px-8 py-16">
      <div className="w-7/12">
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/videos/case-study1.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => {})
          }}
        />
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '500',
            color: '#ffffff',
            fontFamily: 'PP Neue Montreal Book, system-ui, sans-serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.02em'
          }}
        >
          Nour Sabi
        </h3>
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#cccccc',
            fontFamily: 'Instrument Serif, Georgia, serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.01em'
          }}
        >
          Fashion Design UAE
        </h3>
      </div>
      <div className="w-5/12">
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/videos/case-study2.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => {})
          }}
        />
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '500',
            color: '#ffffff',
            fontFamily: 'PP Neue Montreal Book, system-ui, sans-serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.02em'
          }}
        >
          Nour Sabi
        </h3>
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#cccccc',
            fontFamily: 'Instrument Serif, Georgia, serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.01em'
          }}
        >
          Fashion Design UAE
        </h3>
      </div>
    </div>,

    // Slide 2
    <div key={1} className="w-full flex justify-between items-start gap-[32px] px-8 py-16">
      <div className="w-5/12">
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/videos/case-study3.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => {})
          }}
        />
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '500',
            color: '#ffffff',
            fontFamily: 'PP Neue Montreal Book, system-ui, sans-serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.02em'
          }}
        >
          Nour Sabi
        </h3>
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#cccccc',
            fontFamily: 'Instrument Serif, Georgia, serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.01em'
          }}
        >
          Fashion Design UAE
        </h3>
      </div>
      <div className="w-7/12">
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/videos/case-study4.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => {})
          }}
        />
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '500',
            color: '#ffffff',
            fontFamily: 'PP Neue Montreal Book, system-ui, sans-serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.02em'
          }}
        >
          Nour Sabi
        </h3>
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#cccccc',
            fontFamily: 'Instrument Serif, Georgia, serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.01em'
          }}
        >
          Fashion Design UAE
        </h3>
      </div>
    </div>,

    // Slide 3
    <div key={2} className="w-full flex justify-between items-start gap-[32px] px-8 py-16">
      <div className="w-7/12">
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/videos/case-study5.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => {})
          }}
        />
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '500',
            color: '#ffffff',
            fontFamily: 'PP Neue Montreal Book, system-ui, sans-serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.02em'
          }}
        >
          Nour Sabi
        </h3>
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#cccccc',
            fontFamily: 'Instrument Serif, Georgia, serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.01em'
          }}
        >
          Fashion Design UAE
        </h3>
      </div>
      <div className="w-5/12">
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          src="/videos/case-study6.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => {})
          }}
        />
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '500',
            color: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.02em'
          }}
        >
          Nour Sabi
        </h3>
        <h3
          style={{
            fontSize: '48px',
            fontWeight: '400',
            color: '#cccccc',
            fontFamily: 'Instrument Serif, Georgia, serif',
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            letterSpacing: '-0.01em',
            marginBottom: '32px'
          }}
        >
          Fashion Design UAE
        </h3>
      </div>
    </div>
  ]

  return slideContents[slideIndex] || slideContents[0]
}

// Your original shaders - UNCHANGED
const vertexShader = `
  uniform float uScrollIntensity;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 pos = position;

    float sideDistortion = sin(uv.y * 3.14159) * uScrollIntensity * 0.5;
    float topBottomDistortion = sin(uv.x * 3.14159) * uScrollIntensity * 0.2;
    pos.z += sideDistortion + topBottomDistortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D uCurrentTexture;
  uniform sampler2D uNextTexture;
  uniform float uScrollPosition;
  varying vec2 vUv;

  void main() {
    float normalizedPosition = fract(uScrollPosition);
    vec2 currentUv = vec2(vUv.x, mod(vUv.y - normalizedPosition, 1.0));
    vec2 nextUv = vec2(vUv.x, mod(vUv.y + 1.0 - normalizedPosition, 1.0));

    if (vUv.y < normalizedPosition) {
      gl_FragColor = texture2D(uNextTexture, nextUv);
    } else {
      gl_FragColor = texture2D(uCurrentTexture, currentUv);
    }
  }
`

// Your SlidePlane with fixed end transition
// Fixed SlidePlane that properly handles the last slide
const SlidePlane = ({ progress, textures }: { progress: number; textures: THREE.Texture[] }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport } = useThree()

  const scrollVelocity = useRef(0)
  const prevProgress = useRef(0)
  const slideCount = 3

  const uniforms = useRef({
    uScrollIntensity: { value: 0 },
    uScrollPosition: { value: 0 },
    uCurrentTexture: { value: new THREE.Texture() },
    uNextTexture: { value: new THREE.Texture() }
  }).current

  useEffect(() => {
    if (textures[0]) uniforms.uCurrentTexture.value = textures[0]
    if (textures[1]) uniforms.uNextTexture.value = textures[1] || textures[0]
  }, [textures, uniforms])

  useFrame(() => {
    const delta = progress - prevProgress.current
    scrollVelocity.current += (delta - scrollVelocity.current) * 0.1

    const targetProgress = progress
    const lerpSpeed = progress > 0.9 ? 0.15 : 0.05
    prevProgress.current += (targetProgress - prevProgress.current) * lerpSpeed

    // Calculate position but handle the last slide differently
    const totalPosition = prevProgress.current * slideCount
    const index = Math.min(Math.floor(totalPosition), slideCount - 1)
    const nextIndex = Math.min(index + 1, slideCount - 1)

    // Calculate scroll position within current slide
    const scrollPos = totalPosition % 1

    // Key fix: Handle the last slide properly
    if (index >= slideCount - 1) {
      // On the last slide, don't scroll - just show it fully
      uniforms.uScrollPosition.value = 0
      uniforms.uCurrentTexture.value = textures[slideCount - 1]
      uniforms.uNextTexture.value = textures[slideCount - 1] // Same texture to prevent transition
    } else {
      // Normal sliding between slides
      uniforms.uScrollPosition.value = scrollPos
      uniforms.uCurrentTexture.value = textures[index]
      uniforms.uNextTexture.value = textures[nextIndex]
    }

    uniforms.uScrollIntensity.value = scrollVelocity.current * 10

    if (meshRef.current) {
      const scale = 1 + Math.abs(scrollVelocity.current) * 0.1
      meshRef.current.scale.set(scale, scale, 1)
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width * 0.9, viewport.width * 0.9 * (9 / 16), 32, 32]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

const ScrollShaderSlider = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [textures, setTextures] = useState<THREE.Texture[]>([])
  const [isClient, setIsClient] = useState(false)
  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const videoRefs = useRef<HTMLVideoElement[]>([])
  const slideCount = 3

  useEffect(() => {
    setIsClient(true)
  }, [])

  const ensureVideoPlay = async (video: HTMLVideoElement) => {
    try {
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.autoplay = true

      if (video.paused) {
        await video.play()
        console.log('Video started playing:', video.src)
      }
    } catch (error) {
      console.warn('Video autoplay failed:', error)
    }
  }

  const htmlToTexture = async (element: HTMLElement): Promise<THREE.Texture> => {
    return new Promise(async (resolve, reject) => {
      try {
        const videos = element.querySelectorAll('video')
        const playPromises = Array.from(videos).map((video) => {
          videoRefs.current.push(video as HTMLVideoElement)
          return ensureVideoPlay(video as HTMLVideoElement)
        })

        await Promise.all(playPromises)
        await new Promise((resolve) => setTimeout(resolve, 1500))

        const html2canvas = (await import('html2canvas')).default

        const canvas = await html2canvas(element, {
          width: 2560,
          height: 1800, // Increased height to capture more content
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: null,
          logging: false,
          removeContainer: true,
          letterRendering: true,
          onclone: (clonedDoc: any) => {
            const style = clonedDoc.createElement('style')
            style.textContent = `
              * {
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                text-rendering: optimizeLegibility !important;
              }
            `
            clonedDoc.head.appendChild(style)
          }
        } as any)

        const texture = new THREE.CanvasTexture(canvas)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.wrapS = THREE.ClampToEdgeWrapping
        texture.wrapT = THREE.ClampToEdgeWrapping
        texture.flipY = true
        texture.generateMipmaps = false
        resolve(texture)
      } catch (error) {
        console.error('Error converting HTML to texture:', error)
        reject(error)
      }
    })
  }

  useEffect(() => {
    if (!isClient) return

    const captureSlides = async () => {
      const capturedTextures: THREE.Texture[] = []
      await new Promise((resolve) => setTimeout(resolve, 3000))

      for (let i = 0; i < slideCount; i++) {
        const slideElement = slideRefs.current[i]
        if (slideElement) {
          try {
            const texture = await htmlToTexture(slideElement)
            capturedTextures[i] = texture
            console.log(`Captured slide ${i + 1}`)
          } catch (error) {
            console.error(`Error capturing slide ${i}:`, error)
            const canvas = document.createElement('canvas')
            canvas.width = 2560
            canvas.height = 1800
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.fillStyle = `hsl(${i * 120}, 70%, 50%)`
              ctx.fillRect(0, 0, 2560, 1800)
              ctx.fillStyle = 'white'
              ctx.font = 'bold 96px system-ui'
              ctx.textAlign = 'center'
              ctx.fillText(`Slide ${i + 1}`, 1280, 900)

              const fallbackTexture = new THREE.CanvasTexture(canvas)
              fallbackTexture.minFilter = THREE.LinearFilter
              fallbackTexture.magFilter = THREE.LinearFilter
              fallbackTexture.flipY = true
              capturedTextures[i] = fallbackTexture
            }
          }
        }
      }

      setTextures(capturedTextures)
      console.log(`Captured ${capturedTextures.length} slides`)
    }

    captureSlides()
  }, [isClient, slideCount])

  // Enhanced scroll tracking with smoother end transition
  useEffect(() => {
    if (!isClient) return

    const section = sectionRef.current
    if (!section) return

    const handleScroll = () => {
      const rect = section.getBoundingClientRect()
      const sectionHeight = rect.height
      const windowHeight = window.innerHeight
      const sectionTop = rect.top
      const sectionBottom = rect.bottom

      if (sectionBottom < 0 || sectionTop > windowHeight) {
        return
      }

      let progress = 0
      if (sectionTop <= 0) {
        const scrolled = Math.abs(sectionTop)
        const maxScroll = sectionHeight - windowHeight
        progress = Math.min(scrolled / maxScroll, 1)
      }

      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient])

  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        video.pause()
        video.src = ''
        video.load()
      })
      videoRefs.current = []
    }
  }, [])

  if (!isClient) {
    return (
      <section className="relative h-[400vh] bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </section>
    )
  }

  return (
    <>
      {/* Hidden HTML content with sufficient height */}
      <div className="fixed -left-[300vw] top-0 pointer-events-none z-[-1]">
        {Array.from({ length: slideCount }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className="w-[2560px]"
            style={{
              height: '1800px', // Increased height to ensure text is never cut off
              transform: 'scale(1)',
              transformOrigin: 'top left',
              backgroundColor: 'transparent'
            }}
          >
            <SlideContent slideIndex={i} />
          </div>
        ))}
      </div>

      {/* Reduced section height for smoother transition */}
      <section ref={sectionRef} className="relative h-[350vh] bg-black">
        <div className="sticky top-0 h-screen w-full">
          <Canvas camera={{ fov: 75, position: [0, 0, 5] }}>
            <SlidePlane progress={scrollProgress} textures={textures} />
          </Canvas>
        </div>
      </section>
    </>
  )
}

export default ScrollShaderSlider
