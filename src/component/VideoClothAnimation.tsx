'use client'

import React, { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface VideoClothAnimationProps {
  videoSrc: string
  className?: string
  onAnimationComplete?: () => void
  triggerOnScroll?: boolean
  autoPlay?: boolean
}

const VideoClothAnimation: React.FC<VideoClothAnimationProps> = ({
  videoSrc,
  className = '',
  onAnimationComplete,
  triggerOnScroll = true,
  autoPlay = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const meshRef = useRef<THREE.Mesh | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const animationFrameRef = useRef<number>(0)
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null)
  const scrollAnimationRef = useRef<gsap.core.Timeline | null>(null)

  const [isExpanded, setIsExpanded] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  // Enhanced Vertex Shader with optimized performance
  const vertexShader = `
    uniform float u_time;
    uniform float u_rollProgress;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    float easeInOutSine(float x) {
      return -(cos(3.14159265 * x) - 1.0) / 2.0;
    }
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Calculate transform intensity that peaks at 0.5 progress
      float transformIntensity;
      if (u_rollProgress <= 0.5) {
        transformIntensity = easeInOutSine(u_rollProgress * 2.0);
      } else {
        transformIntensity = easeInOutSine((1.0 - u_rollProgress) * 2.0);
      }
      
      // Apply optimized skew + curve transform when intensity is active
      if (transformIntensity > 0.01) {
        // 1. OPTIMIZED SKEW TRANSFORMATION
        float rotationAmount = pos.x * 0.12 * transformIntensity;
        
        float cosAngle = cos(rotationAmount);
        float sinAngle = sin(rotationAmount);
        
        // Apply skew rotation to Y and Z coordinates
        float skewedY = pos.y * cosAngle - pos.z * sinAngle;
        float skewedZ = pos.y * sinAngle + pos.z * cosAngle;
        
        // 2. OPTIMIZED CURVE TRANSFORMATION
        float curveIntensity = transformIntensity * 0.25;
        
        // Simplified curve calculations for better performance
        float horizontalCurve = sin(pos.x * 0.6 + u_time * 0.4) * curveIntensity;
        float verticalCurve = sin(pos.y * 0.5 + u_time * 0.2) * curveIntensity;
        
        // Apply combined transformations
        pos.y = skewedY + horizontalCurve;
        pos.z = skewedZ + verticalCurve;
        
        // 3. OPTIMIZED DEPTH VARIATION
        float depthCurve = pos.x * pos.x * 0.008 * transformIntensity;
        pos.z += depthCurve;
        
        // 4. EDGE PRESERVATION with better performance
        float edgeDistance = 0.08;
        
        // Preserve top edge
        if (pos.y > (3.375 - edgeDistance)) {
          float edgeFactor = (3.375 - pos.y) / edgeDistance;
          edgeFactor = clamp(edgeFactor, 0.0, 1.0);
          
          pos.y = mix(3.375, pos.y, edgeFactor);
          pos.z = mix(0.0, pos.z, edgeFactor);
        }
        
        // Preserve right edge  
        if (pos.x > (3.0 - edgeDistance)) {
          float edgeFactor = (3.0 - pos.x) / edgeDistance;
          edgeFactor = clamp(edgeFactor, 0.0, 1.0);
          
          pos.x = mix(3.0, pos.x, edgeFactor);
          pos.z = mix(0.0, pos.z, edgeFactor);
        }
      }
      
      vPosition = pos;
      
      // Optimized normal calculation
      if (transformIntensity > 0.01) {
        vec3 tangentX = vec3(1.0, 0.0, 0.0);
        vec3 tangentY = vec3(0.0, 1.0, 0.0);
        
        float rotationAmount = pos.x * 0.12 * transformIntensity;
        float cosAngle = cos(rotationAmount);
        float sinAngle = sin(rotationAmount);
        
        tangentY = vec3(0.0, cosAngle, sinAngle);
        
        float curveInfluence = transformIntensity * 0.25;
        tangentX.z += cos(pos.x * 0.6) * curveInfluence * 0.6;
        tangentY.z += cos(pos.y * 0.5) * curveInfluence * 0.5;
        
        vNormal = normalize(cross(tangentX, tangentY));
      } else {
        vNormal = normal;
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  // Enhanced Fragment Shader with better performance
  const fragmentShader = `
    uniform sampler2D u_texture;
    uniform float u_time;
    uniform float u_opacity;
    uniform float u_rollProgress;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    
    void main() {
      vec2 uv = vUv;
      
      // Keep video perfectly clean
      vec4 textureColor = texture2D(u_texture, uv);
      
      // Calculate transform intensity with optimized math
      float transformIntensity;
      if (u_rollProgress <= 0.5) {
        transformIntensity = (sin((u_rollProgress * 2.0 - 0.5) * 3.14159265) + 1.0) * 0.5;
      } else {
        transformIntensity = (sin(((1.0 - u_rollProgress) * 2.0 - 0.5) * 3.14159265) + 1.0) * 0.5;
      }
      
      // Optimized lighting for curved surface
      vec3 lightDir = normalize(vec3(1.0, 0.5, 2.0));
      vec3 lightDir2 = normalize(vec3(-0.5, 1.0, 1.5));
      
      float NdotL1 = dot(normalize(vNormal), lightDir);
      float NdotL2 = dot(normalize(vNormal), lightDir2);
      
      float lighting = mix(
        0.98,
        max(0.85, (NdotL1 * 0.35 + NdotL2 * 0.15 + 0.65)),
        transformIntensity * 0.5
      );
      
      float ambientBoost = transformIntensity * 0.03;
      lighting += ambientBoost;
      
      gl_FragColor = vec4(textureColor.rgb * lighting, textureColor.a * u_opacity);
    }
  `

  const initThreeJS = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    // Scene setup
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Renderer setup with BLACK background
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false // Changed to false for solid background
    })
    renderer.setSize(containerWidth, containerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1) // Pure black background
    rendererRef.current = renderer

    // Video setup
    const video = document.createElement('video')
    video.src = videoSrc
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true

    video.addEventListener('loadeddata', () => {
      setVideoLoaded(true)
      if (autoPlay) {
        video.play()
      }
    })

    videoRef.current = video

    // Video texture
    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    videoTexture.format = THREE.RGBFormat

    // Fixed geometry size with optimized resolution
    const meshWidth = 6
    const meshHeight = meshWidth * (9 / 16)

    // Optimized geometry resolution for better performance
    const geometry = new THREE.PlaneGeometry(meshWidth, meshHeight, 48, 28)

    // Material with enhanced shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_texture: { value: videoTexture },
        u_time: { value: 0 },
        u_rollProgress: { value: 0.0 },
        u_opacity: { value: 1.0 }
      },
      transparent: true,
      side: THREE.DoubleSide
    })

    // Mesh
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshRef.current = mesh

    // Calculate positions
    const distance = 5
    const fov = (camera.fov * Math.PI) / 180
    const visibleHeight = 2 * Math.tan(fov / 2) * distance
    const visibleWidth = visibleHeight * camera.aspect

    // Initial position - TOP-RIGHT, 50% scale
    const scaledWidth = meshWidth * 0.5
    const scaledHeight = meshHeight * 0.5

    const absoluteTopY = visibleHeight / 2 - scaledHeight / 2
    const absoluteRightX = visibleWidth / 2 - scaledWidth / 2

    mesh.position.set(absoluteRightX, absoluteTopY, 0)
    mesh.scale.set(0.5, 0.5, 0.5)
    mesh.rotation.set(0, 0, 0)
  }, [videoSrc, autoPlay])

  const animate = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !meshRef.current) return

    const elapsedTime = clockRef.current.getElapsedTime()

    // Update shader uniforms with optimized timing
    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.u_time.value = elapsedTime * 0.8 // Reduced time multiplier for smoother animation

    // Render
    rendererRef.current.render(sceneRef.current, cameraRef.current)
    animationFrameRef.current = requestAnimationFrame(animate)
  }, [])

  const calculatePositions = useCallback(() => {
    if (!cameraRef.current || !meshRef.current) return { rightX: 0, topY: 0, centerX: 0 }

    const camera = cameraRef.current
    const distance = 5
    const fov = (camera.fov * Math.PI) / 180
    const visibleHeight = 2 * Math.tan(fov / 2) * distance
    const visibleWidth = visibleHeight * camera.aspect

    const geometry = meshRef.current.geometry as THREE.PlaneGeometry
    const meshWidth = geometry.parameters.width
    const meshHeight = geometry.parameters.height

    const topY = visibleHeight / 2 - meshHeight / 2
    const rightX = visibleWidth / 2 - (meshWidth * 0.5) / 2
    const centerX = 0

    return { rightX, topY, centerX }
  }, [])

  const setupScrollAnimation = useCallback(() => {
    if (!triggerOnScroll || !containerRef.current || !meshRef.current) return

    // Clean up existing animations
    if (scrollTriggerRef.current) {
      scrollTriggerRef.current.kill()
    }
    if (scrollAnimationRef.current) {
      scrollAnimationRef.current.kill()
    }

    const material = meshRef.current.material as THREE.ShaderMaterial
    const { topY } = calculatePositions()

    // Timeline: Rectangle → Skew+Curve Transform → Rectangle with optimized timing
    scrollAnimationRef.current = gsap
      .timeline({
        paused: true,
        onUpdate: () => {
          const progress = scrollAnimationRef.current?.progress() || 0
          if (progress > 0.8 && !isExpanded) {
            setIsExpanded(true)
          } else if (progress < 0.2 && isExpanded) {
            setIsExpanded(false)
          }
        },
        onComplete: () => {
          onAnimationComplete?.()
        }
      })
      .to(meshRef.current.scale, {
        duration: 1.2,
        x: 1.0,
        y: 1.0,
        z: 1.0,
        ease: 'power2.inOut'
      })
      .to(
        meshRef.current.position,
        {
          duration: 1.2,
          x: 0,
          y: topY,
          z: 0,
          ease: 'power2.inOut'
        },
        0
      )
      .to(
        material.uniforms.u_rollProgress,
        {
          duration: 1.2,
          value: 1.0,
          ease: 'power2.inOut'
        },
        0
      )

    // Create ScrollTrigger with optimized scrub value
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1.2, // Reduced for smoother animation
      animation: scrollAnimationRef.current,
      onEnter: () => {
        videoRef.current?.play()
      }
    })
  }, [triggerOnScroll, isExpanded, calculatePositions, onAnimationComplete])

  const handleResize = useCallback(() => {
    if (!containerRef.current || !rendererRef.current || !cameraRef.current || !meshRef.current)
      return

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    cameraRef.current.aspect = containerWidth / containerHeight
    cameraRef.current.updateProjectionMatrix()
    rendererRef.current.setSize(containerWidth, containerHeight)

    const { rightX, topY, centerX } = calculatePositions()

    if (isExpanded) {
      meshRef.current.position.set(centerX, topY, 0)
    } else {
      meshRef.current.position.set(rightX, topY, 0)
    }
  }, [isExpanded, calculatePositions])

  useEffect(() => {
    initThreeJS()
    animate()

    const timer = setTimeout(() => {
      setupScrollAnimation()
    }, 500)

    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (scrollTriggerRef.current) {
        scrollTriggerRef.current.kill()
      }
      if (scrollAnimationRef.current) {
        scrollAnimationRef.current.kill()
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
      if (videoRef.current) {
        videoRef.current.pause()
        videoRef.current.src = ''
      }
    }
  }, [initThreeJS, animate, setupScrollAnimation, handleResize])

  useEffect(() => {
    if (videoLoaded) {
      const timer = setTimeout(() => {
        setupScrollAnimation()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [videoLoaded, setupScrollAnimation])

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} style={{ height: '300vh' }}>
      <div className="sticky top-0 w-full h-screen bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  )
}

export default VideoClothAnimation
