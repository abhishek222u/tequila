// ScrollShaderSlider.tsx
'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Optimized slide content with memoization
const SlideContent = ({ slideIndex }: { slideIndex: number }) => {
  const slideContents = useMemo(() => [
    // Slide 1
    <div key={0} className="w-full flex justify-between items-start gap-[32px] px-8 py-16">
      <div className="w-7/12 relative">
        <div className=" bg-black text-white p-2 absolute -top-3 left-0">
          Branding, Website
        </div>
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src="/videos/case-study1.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => { })
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
      <div className="w-5/12 relative">
        <div className=" bg-black text-white p-2 absolute -top-3 left-0">
          Branding, Website
        </div>
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src="/videos/case-study2.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => { })
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
      <div className="w-5/12 relative">
        <div className=" bg-black text-white p-2 absolute -top-3 left-0">
          Branding, Website
        </div>
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src="/videos/case-study3.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => { })
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
      <div className="w-7/12 relative">
        <div className=" bg-black text-white p-2 absolute -top-3 left-0">
          Branding, Website
        </div>
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src="/videos/case-study4.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => { })
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
      <div className="w-7/12 relative">
        <div className=" bg-black text-white p-2 absolute -top-3 left-0">
          Branding, Website
        </div>
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src="/videos/case-study5.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => { })
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
      <div className="w-5/12 relative">
        <div className=" bg-black text-white p-2 absolute -top-3 left-0">
          Branding, Website
        </div>
        <video
          className="w-full mb-[24px]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          src="/videos/case-study6.mp4"
          style={{ maxWidth: 'inherit', maxHeight: 'inherit' }}
          onCanPlay={(e) => {
            e.currentTarget.play().catch(() => { })
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
            letterSpacing: '-0.01em',
            marginBottom: '32px'
          }}
        >
          Fashion Design UAE
        </h3>
      </div>
    </div>
  ], [])

  return slideContents[slideIndex] || slideContents[0]
}

// Optimized vertex shader with better performance
const vertexShader = `
  uniform float uScrollIntensity;
  uniform float uTime;
  varying vec2 vUv;
  varying float vDistortion;

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Optimized wave animation with reduced complexity
    float distortion = sin(uv.y * 3.14159) * (-uScrollIntensity) * 0.25;
    distortion += sin(uv.x * 3.14159) * (-uScrollIntensity) * 0.12;
    
    // Simplified wave effect for better performance
    distortion += sin(uv.y * 6.28318 - uTime * 1.5) * 0.03;
    
    pos.z += distortion;
    vDistortion = distortion;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`

// Optimized fragment shader with better performance
const fragmentShader = `
  uniform sampler2D uCurrentTexture;
  uniform sampler2D uNextTexture;
  uniform float uScrollPosition;
  uniform float uScrollIntensity;
  varying vec2 vUv;
  varying float vDistortion;

  void main() {
    // Optimized transition calculation
    float transition = smoothstep(0.0, 0.08, uScrollPosition) - smoothstep(0.92, 1.0, uScrollPosition);
    
    // Optimized UV calculation
    vec2 currentUv = vec2(vUv.x, mod(vUv.y - uScrollPosition, 1.0));
    vec2 nextUv = vec2(vUv.x, mod(vUv.y + 1.0 - uScrollPosition, 1.0));

    vec4 currentColor = texture2D(uCurrentTexture, currentUv);
    vec4 nextColor = texture2D(uNextTexture, nextUv);

    // Enhanced blending with optimized distortion effect
    float blendFactor = smoothstep(0.0, 1.0, uScrollPosition);
    vec4 finalColor = mix(currentColor, nextColor, blendFactor);
    
    // Optimized distortion effect
    if (uScrollIntensity > 0.08) {
      float distortion = abs(vDistortion) * 0.08;
      finalColor.rgb += distortion * 0.08;
    }

    gl_FragColor = finalColor;
  }
`

// Optimized SlidePlane with better performance
const SlidePlane = ({ progress, textures }: { progress: number; textures: THREE.Texture[] }) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const { viewport, clock } = useThree()

  // Optimized refs and state
  const scrollVelocity = useRef(0)
  const prevProgress = useRef(0)
  const targetProgress = useRef(0)
  const slideCount = 3

  // Memoized uniforms for better performance
  const uniforms = useMemo(() => ({
    uScrollIntensity: { value: 0 },
    uScrollPosition: { value: 0 },
    uCurrentTexture: { value: new THREE.Texture() },
    uNextTexture: { value: new THREE.Texture() },
    uTime: { value: 0 }
  }), [])

  // Update textures when they change
  useEffect(() => {
    if (textures[0]) uniforms.uCurrentTexture.value = textures[0]
    if (textures[1]) uniforms.uNextTexture.value = textures[1] || textures[0]
  }, [textures, uniforms])

  // Optimized frame update with better interpolation
  useFrame(() => {
    const time = clock.getElapsedTime()
    uniforms.uTime.value = time

    // Smooth progress interpolation with optimized damping
    const delta = progress - prevProgress.current
    scrollVelocity.current += (delta - scrollVelocity.current) * 0.06 // Reduced for smoother feel

    // Enhanced easing for end transition
    const easing = progress > 0.9 ? 0.06 : 0.025
    prevProgress.current += (progress - prevProgress.current) * easing

    // Calculate slide position with better handling
    const totalPosition = prevProgress.current * slideCount
    const index = Math.min(Math.floor(totalPosition), slideCount - 1)
    const nextIndex = Math.min(index + 1, slideCount - 1)
    const scrollPos = totalPosition % 1

    // Enhanced end slide handling
    if (index >= slideCount - 1) {
      uniforms.uScrollPosition.value = 0
      uniforms.uCurrentTexture.value = textures[slideCount - 1]
      uniforms.uNextTexture.value = textures[slideCount - 1]
    } else {
      uniforms.uScrollPosition.value = scrollPos
      uniforms.uCurrentTexture.value = textures[index]
      uniforms.uNextTexture.value = textures[nextIndex]
    }

    // Optimized scroll intensity with better damping
    uniforms.uScrollIntensity.value = Math.min(scrollVelocity.current * 6, 1.5)

    // Smooth scale animation with optimized lerp
    if (meshRef.current) {
      const targetScale = 1 + Math.abs(scrollVelocity.current) * 0.03
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, 1), 0.08)
    }
  })

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[viewport.width * 0.9, viewport.width * 0.9 * (9 / 16), 48, 48]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.DoubleSide}
        transparent={true}
        alphaTest={0.1}
      />
    </mesh>
  )
}

// Main component with significant optimizations
const ScrollShaderSlider = () => {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [textures, setTextures] = useState<THREE.Texture[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const slideRefs = useRef<(HTMLDivElement | null)[]>([])
  const videoRefs = useRef<HTMLVideoElement[]>([])
  const slideCount = 3

  // Optimized video management
  const ensureVideoPlay = useCallback(async (video: HTMLVideoElement) => {
    try {
      video.muted = true
      video.loop = true
      video.playsInline = true
      video.autoplay = true
      video.preload = 'metadata'

      if (video.paused) {
        await video.play()
      }
    } catch (error) {
      console.warn('Video autoplay failed:', error)
    }
  }, [])

  // Optimized HTML to texture conversion
  const htmlToTexture = useCallback(async (element: HTMLElement): Promise<THREE.Texture> => {
    return new Promise(async (resolve, reject) => {
      try {
        const videos = element.querySelectorAll('video')
        const playPromises = Array.from(videos).map((video) => {
          videoRefs.current.push(video as HTMLVideoElement)
          return ensureVideoPlay(video as HTMLVideoElement)
        })

        await Promise.all(playPromises)
        await new Promise((resolve) => setTimeout(resolve, 1000)) // Reduced wait time

        const html2canvas = (await import('html2canvas')).default

        const canvas = await html2canvas(element, {
          width: 1920, // Reduced for better performance
          height: 1080, // Reduced for better performance
          scale: 1.5, // Reduced scale for better performance
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

        // Dispose of canvas to free memory
        canvas.remove()

        resolve(texture)
      } catch (error) {
        console.error('Error converting HTML to texture:', error)
        reject(error)
      }
    })
  }, [ensureVideoPlay])

  // Optimized texture capture
  useEffect(() => {
    if (!isClient) return

    const captureSlides = async () => {
      setIsLoading(true)
      const capturedTextures: THREE.Texture[] = []

      // Reduced initial wait time
      await new Promise((resolve) => setTimeout(resolve, 2000))

      for (let i = 0; i < slideCount; i++) {
        const slideElement = slideRefs.current[i]
        if (slideElement) {
          try {
            const texture = await htmlToTexture(slideElement)
            capturedTextures[i] = texture
            console.log(`Captured slide ${i + 1}`)
          } catch (error) {
            console.error(`Error capturing slide ${i}:`, error)
            // Create fallback texture
            const canvas = document.createElement('canvas')
            canvas.width = 1920
            canvas.height = 1080
            const ctx = canvas.getContext('2d')
            if (ctx) {
              ctx.fillStyle = `hsl(${i * 120}, 70%, 50%)`
              ctx.fillRect(0, 0, 1920, 1080)
              ctx.fillStyle = 'white'
              ctx.font = 'bold 96px system-ui'
              ctx.textAlign = 'center'
              ctx.fillText(`Slide ${i + 1}`, 960, 540)

              const fallbackTexture = new THREE.CanvasTexture(canvas)
              fallbackTexture.minFilter = THREE.LinearFilter
              fallbackTexture.magFilter = THREE.LinearFilter
              fallbackTexture.flipY = true
              capturedTextures[i] = fallbackTexture

              // Dispose of canvas
              canvas.remove()
            }
          }
        }
      }

      setTextures(capturedTextures)
      setIsLoading(false)
      console.log(`Captured ${capturedTextures.length} slides`)
    }

    captureSlides()
  }, [isClient, slideCount, htmlToTexture])

  // Optimized scroll handling with throttling
  useEffect(() => {
    if (!isClient) return

    const section = sectionRef.current
    if (!section) return

    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const rect = section.getBoundingClientRect()
          const sectionHeight = rect.height
          const windowHeight = window.innerHeight
          const sectionTop = rect.top
          const sectionBottom = rect.bottom

          if (sectionBottom < 0 || sectionTop > windowHeight) {
            ticking = false
            return
          }

          let progress = 0
          if (sectionTop <= 0) {
            const scrolled = Math.abs(sectionTop)
            const maxScroll = sectionHeight - windowHeight
            progress = Math.min(scrolled / maxScroll, 1)
          }

          setScrollProgress(progress)
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isClient])

  // Enhanced cleanup
  useEffect(() => {
    return () => {
      videoRefs.current.forEach((video) => {
        video.pause()
        video.src = ''
        video.load()
      })
      videoRefs.current = []

      // Dispose textures to free memory
      textures.forEach(texture => {
        if (texture) texture.dispose()
      })
    }
  }, [textures])

  useEffect(() => {
    setIsClient(true)
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
      {/* Hidden HTML content with optimized dimensions */}
      <div className="fixed -left-[300vw] top-0 pointer-events-none z-[-1]">
        {Array.from({ length: slideCount }, (_, i) => (
          <div
            key={i}
            ref={(el) => {
              slideRefs.current[i] = el
            }}
            className="w-[1920px]"
            style={{
              height: '1080px',
              transform: 'scale(1)',
              transformOrigin: 'top left',
              backgroundColor: 'transparent'
            }}
          >
            <SlideContent slideIndex={i} />
          </div>
        ))}
      </div>

      {/* Main section with loading state */}
      <section ref={sectionRef} className="relative h-[350vh] bg-black">
        <div className="sticky top-0 h-screen w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-white text-xl">Preparing slides...</div>
            </div>
          ) : (
            <Canvas
              camera={{ fov: 75, position: [0, 0, 5] }}
              gl={{
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance',
                stencil: false,
                depth: false
              }}
              dpr={Math.min(window.devicePixelRatio, 2)} // Limit DPR for performance
            >
              <SlidePlane progress={scrollProgress} textures={textures} />
            </Canvas>
          )}
        </div>
      </section>
    </>
  )
}

export default ScrollShaderSlider
