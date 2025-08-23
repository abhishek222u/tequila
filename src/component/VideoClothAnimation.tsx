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

  // Enhanced Vertex Shader with advanced physics and realistic cloth simulation
  const vertexShader = `
    uniform float u_time;
    uniform float u_rollProgress;
    uniform float u_mouseX;
    uniform float u_mouseY;
    uniform float u_resolution;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDepth;
    varying float vDistortion;
    
    // Improved easing functions
    float easeOutQuart(float x) {
      return 1.0 - pow(1.0 - x, 4.0);
    }
    
    float easeInOutCubic(float x) {
      return x < 0.5 ? 4.0 * x * x * x : 1.0 - pow(-2.0 * x + 2.0, 3.0) / 2.0;
    }
    
    // Advanced noise function for realistic cloth movement
    float noise(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }
    
    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = noise(i);
      float b = noise(i + vec2(1.0, 0.0));
      float c = noise(i + vec2(0.0, 1.0));
      float d = noise(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    // Cloth physics simulation
    vec3 applyClothPhysics(vec3 pos, float intensity) {
      vec3 clothPos = pos;
      
      // Gravity effect
      float gravity = sin(u_time * 0.5) * 0.02 * intensity;
      clothPos.z -= gravity;
      
      // Wind effect
      float windStrength = 0.015 * intensity;
      float windX = sin(u_time * 0.3) * windStrength;
      float windY = cos(u_time * 0.4) * windStrength;
      clothPos.x += windX;
      clothPos.y += windY;
      
      // Fabric tension and elasticity
      float tension = 0.8 + 0.2 * intensity;
      float elasticity = 0.95;
      
      // Apply tension to edges
      float edgeInfluence = 0.1;
      if (abs(pos.x) > 2.5) {
        clothPos.x *= elasticity;
        clothPos.x += (pos.x - clothPos.x) * edgeInfluence;
      }
      if (abs(pos.y) > 1.5) {
        clothPos.y *= elasticity;
        clothPos.y += (pos.y - clothPos.y) * edgeInfluence;
      }
      
      return clothPos;
    }
    
    void main() {
      vUv = uv;
      vec3 pos = position;
      
      // Calculate transform intensity with improved easing
      float transformIntensity;
      if (u_rollProgress <= 0.5) {
        transformIntensity = easeInOutCubic(u_rollProgress * 2.0);
      } else {
        transformIntensity = easeInOutCubic((1.0 - u_rollProgress) * 2.0);
      }
      
      // Apply advanced transformations when intensity is active
      if (transformIntensity > 0.01) {
        // 1. ENHANCED SKEW TRANSFORMATION with realistic perspective
        float rotationAmount = pos.x * 0.15 * transformIntensity;
        float perspectiveSkew = pos.x * pos.x * 0.02 * transformIntensity;
        
        float cosAngle = cos(rotationAmount);
        float sinAngle = sin(rotationAmount);
        
        // Apply skew rotation with perspective
        float skewedY = pos.y * cosAngle - pos.z * sinAngle;
        float skewedZ = pos.y * sinAngle + pos.z * cosAngle;
        
        // 2. ADVANCED CURVE TRANSFORMATION with multiple frequency waves
        float curveIntensity = transformIntensity * 0.3;
        
        // Primary wave
        float primaryWave = sin(pos.x * 0.8 + u_time * 0.3) * curveIntensity;
        float secondaryWave = sin(pos.x * 1.6 + u_time * 0.6) * curveIntensity * 0.5;
        float tertiaryWave = sin(pos.x * 2.4 + u_time * 0.9) * curveIntensity * 0.25;
        
        // Vertical waves
        float verticalWave = sin(pos.y * 0.7 + u_time * 0.2) * curveIntensity * 0.6;
        float verticalWave2 = sin(pos.y * 1.4 + u_time * 0.4) * curveIntensity * 0.3;
        
        // Combine all waves
        float horizontalCurve = primaryWave + secondaryWave + tertiaryWave;
        float verticalCurve = verticalWave + verticalWave2;
        
        // 3. ADVANCED DEPTH VARIATION with realistic perspective
        float depthCurve = pos.x * pos.x * 0.012 * transformIntensity;
        float depthWave = sin(pos.x * 0.5 + u_time * 0.1) * 0.008 * transformIntensity;
        
        // 4. MOUSE INTERACTION (subtle)
        float mouseInfluence = 0.02;
        float mouseDistance = distance(pos.xy, vec2(u_mouseX, u_mouseY));
        float mouseEffect = smoothstep(2.0, 0.0, mouseDistance) * mouseInfluence * transformIntensity;
        
        // 5. NOISE-BASED MICRO-MOVEMENTS for realistic fabric texture
        float noiseScale = 2.0;
        float noiseIntensity = 0.008 * transformIntensity;
        vec2 noiseCoord = pos.xy * noiseScale + u_time * 0.1;
        float fabricNoise = smoothNoise(noiseCoord) * noiseIntensity;
        
        // Apply all transformations
        pos.y = skewedY + horizontalCurve + mouseEffect + fabricNoise;
        pos.z = skewedZ + verticalCurve + depthCurve + depthWave;
        pos.x += fabricNoise * 0.5;
        
        // 6. ENHANCED EDGE PRESERVATION with smooth falloff
        float edgeDistance = 0.12;
        float edgeSmoothness = 0.8;
        
        // Preserve top edge with smooth transition
        if (pos.y > (3.375 - edgeDistance)) {
          float edgeFactor = (3.375 - pos.y) / edgeDistance;
          edgeFactor = smoothstep(0.0, edgeSmoothness, clamp(edgeFactor, 0.0, 1.0));
          
          pos.y = mix(3.375, pos.y, edgeFactor);
          pos.z = mix(0.0, pos.z, edgeFactor);
        }
        
        // Preserve right edge with smooth transition
        if (pos.x > (3.0 - edgeDistance)) {
          float edgeFactor = (3.0 - pos.x) / edgeDistance;
          edgeFactor = smoothstep(0.0, edgeSmoothness, clamp(edgeFactor, 0.0, 1.0));
          
          pos.x = mix(3.0, pos.x, edgeFactor);
          pos.z = mix(0.0, pos.z, edgeFactor);
        }
        
        // 7. APPLY CLOTH PHYSICS
        pos = applyClothPhysics(pos, transformIntensity);
      }
      
      vPosition = pos;
      vDepth = pos.z;
      vDistortion = transformIntensity;
      
      // Enhanced normal calculation for realistic lighting
      if (transformIntensity > 0.01) {
        vec3 tangentX = vec3(1.0, 0.0, 0.0);
        vec3 tangentY = vec3(0.0, 1.0, 0.0);
        
        float rotationAmount = pos.x * 0.15 * transformIntensity;
        float cosAngle = cos(rotationAmount);
        float sinAngle = sin(rotationAmount);
        
        tangentY = vec3(0.0, cosAngle, sinAngle);
        
        float curveInfluence = transformIntensity * 0.3;
        tangentX.z += cos(pos.x * 0.8) * curveInfluence * 0.8;
        tangentY.z += cos(pos.y * 0.7) * curveInfluence * 0.7;
        
        vNormal = normalize(cross(tangentX, tangentY));
      } else {
        vNormal = normal;
      }
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `

  // Enhanced Fragment Shader with advanced lighting and effects
  const fragmentShader = `
    uniform sampler2D u_texture;
    uniform float u_time;
    uniform float u_opacity;
    uniform float u_rollProgress;
    uniform float u_mouseX;
    uniform float u_mouseY;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying float vDepth;
    varying float vDistortion;
    
    // Improved lighting functions
    vec3 calculateLighting(vec3 normal, vec3 lightDir, float intensity) {
      float NdotL = max(0.0, dot(normal, lightDir));
      float specular = pow(max(0.0, dot(reflect(-lightDir, normal), vec3(0.0, 0.0, 1.0))), 32.0);
      return vec3(NdotL * intensity + specular * 0.3);
    }
    
    // Fresnel effect for realistic fabric
    float fresnel(vec3 viewDir, vec3 normal, float power) {
      return pow(1.0 - max(0.0, dot(viewDir, normal)), power);
    }
    
    // Subsurface scattering simulation for fabric
    vec3 subsurfaceScattering(vec3 normal, vec3 lightDir, vec3 color) {
      float wrap = 0.5;
      float NdotL = max(0.0, (dot(normal, lightDir) + wrap) / (1.0 + wrap));
      return color * NdotL * 0.3;
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Keep video perfectly clean
      vec4 textureColor = texture2D(u_texture, uv);
      
      // Calculate transform intensity with improved math
      float transformIntensity;
      if (u_rollProgress <= 0.5) {
        transformIntensity = (sin((u_rollProgress * 2.0 - 0.5) * 3.14159265) + 1.0) * 0.5;
      } else {
        transformIntensity = (sin(((1.0 - u_rollProgress) * 2.0 - 0.5) * 3.14159265) + 1.0) * 0.5;
      }
      
      // Enhanced lighting setup with multiple light sources
      vec3 lightDir1 = normalize(vec3(1.0, 0.5, 2.0));
      vec3 lightDir2 = normalize(vec3(-0.5, 1.0, 1.5));
      vec3 lightDir3 = normalize(vec3(0.0, -0.8, 1.2));
      
      vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
      
      // Calculate lighting contributions
      vec3 lighting1 = calculateLighting(normalize(vNormal), lightDir1, 0.4);
      vec3 lighting2 = calculateLighting(normalize(vNormal), lightDir2, 0.25);
      vec3 lighting3 = calculateLighting(normalize(vNormal), lightDir3, 0.15);
      
      // Combine lighting
      vec3 totalLighting = lighting1 + lighting2 + lighting3;
      
      // Ambient lighting with depth variation
      float ambientBase = 0.65;
      float ambientDepth = smoothstep(-2.0, 2.0, vDepth) * 0.1;
      float ambient = ambientBase + ambientDepth;
      
      // Fresnel effect for realistic fabric appearance
      float fresnelIntensity = fresnel(viewDir, normalize(vNormal), 3.0) * 0.2;
      
      // Subsurface scattering for fabric
      vec3 subsurface = subsurfaceScattering(normalize(vNormal), lightDir1, textureColor.rgb);
      
      // Apply lighting with enhanced realism
      float lighting = mix(
        ambient,
        max(ambient, totalLighting.r + totalLighting.g + totalLighting.b),
        transformIntensity * 0.6
      );
      
      // Add subtle color variation based on distortion
      vec3 colorVariation = vec3(1.0);
      if (vDistortion > 0.1) {
        float variation = sin(vPosition.x * 2.0 + u_time * 0.5) * 0.02;
        colorVariation = vec3(1.0 + variation, 1.0, 1.0 - variation);
      }
      
      // Final color calculation
      vec3 finalColor = textureColor.rgb * lighting * colorVariation + subsurface + fresnelIntensity;
      
      // Vignette effect removed to eliminate faded corners
      
      gl_FragColor = vec4(finalColor, textureColor.a * u_opacity);
    }
  `

  const initThreeJS = useCallback(() => {
    if (!containerRef.current || !canvasRef.current) return

    const containerWidth = containerRef.current.clientWidth
    const containerHeight = containerRef.current.clientHeight

    // Scene setup with enhanced environment
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Enhanced camera setup with better perspective
    const camera = new THREE.PerspectiveCamera(60, containerWidth / containerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Enhanced renderer setup with better quality
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false,
      powerPreference: 'high-performance'
    })
    renderer.setSize(containerWidth, containerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    rendererRef.current = renderer

    // Video setup with enhanced quality
    const video = document.createElement('video')
    video.src = videoSrc
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    video.addEventListener('loadeddata', () => {
      setVideoLoaded(true)
      if (autoPlay) {
        video.play()
      }
    })

    videoRef.current = video

    // Enhanced video texture with better filtering
    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter
    videoTexture.format = THREE.RGBFormat
    videoTexture.generateMipmaps = false

    // Enhanced geometry with higher resolution for smoother deformation
    const meshWidth = 6
    const meshHeight = meshWidth * (9 / 16)
    const geometry = new THREE.PlaneGeometry(meshWidth, meshHeight, 64, 36)

    // Enhanced material with improved shaders
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        u_texture: { value: videoTexture },
        u_time: { value: 0 },
        u_rollProgress: { value: 0.0 },
        u_opacity: { value: 1.0 },
        u_mouseX: { value: 0.0 },
        u_mouseY: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(containerWidth, containerHeight) }
      },
      transparent: true,
      side: THREE.DoubleSide
    })

    // Mesh with enhanced properties
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)
    meshRef.current = mesh

    // Calculate positions with enhanced precision
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

    // Update shader uniforms with enhanced timing
    const material = meshRef.current.material as THREE.ShaderMaterial
    material.uniforms.u_time.value = elapsedTime * 0.6 // Optimized for smoother animation

    // Render with enhanced quality
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

    // Enhanced timeline with smoother easing and better timing
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
        duration: 1.0,
        x: 1.0,
        y: 1.0,
        z: 1.0,
        ease: 'power3.out'
      })
      .to(
        meshRef.current.position,
        {
          duration: 1.0,
          x: 0,
          y: topY,
          z: 0,
          ease: 'power3.out'
        },
        0
      )
      .to(
        material.uniforms.u_rollProgress,
        {
          duration: 1.0,
          value: 1.0,
          ease: 'power3.out'
        },
        0
      )

    // Enhanced ScrollTrigger with better scrub value for smoother animation
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top center',
      end: 'bottom center',
      scrub: 0.8, // Faster animation for shorter scroll distance
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

    // Update resolution uniform
    const material = meshRef.current.material as THREE.ShaderMaterial
    if (material.uniforms.u_resolution) {
      material.uniforms.u_resolution.value.set(containerWidth, containerHeight)
    }

    const { rightX, topY, centerX } = calculatePositions()

    if (isExpanded) {
      meshRef.current.position.set(centerX, topY, 0)
    } else {
      meshRef.current.position.set(rightX, topY, 0)
    }
  }, [isExpanded, calculatePositions])

  // Enhanced mouse interaction
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!meshRef.current) return

    const material = meshRef.current.material as THREE.ShaderMaterial
    if (material.uniforms.u_mouseX && material.uniforms.u_mouseY) {
      // Convert mouse coordinates to normalized space
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1
        
        material.uniforms.u_mouseX.value = mouseX * 3 // Scale to mesh space
        material.uniforms.u_mouseY.value = mouseY * 2 // Scale to mesh space
      }
    }
  }, [])

  useEffect(() => {
    initThreeJS()
    animate()

    const timer = setTimeout(() => {
      setupScrollAnimation()
    }, 500)

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
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
  }, [initThreeJS, animate, setupScrollAnimation, handleResize, handleMouseMove])

  useEffect(() => {
    if (videoLoaded) {
      const timer = setTimeout(() => {
        setupScrollAnimation()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [videoLoaded, setupScrollAnimation])

  return (
    <div ref={containerRef} className={`relative w-full ${className}`} style={{ height: '150vh' }}>
      <div className="sticky top-0 w-full h-screen bg-black">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      </div>
    </div>
  )
}

export default VideoClothAnimation
