'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { gsap } from 'gsap'
import * as THREE from 'three'

interface Award {
  year: string
  organization: string
  category: string
  thumbnail: string
}

interface AwardsSelectionProps {
  awards: Award[]
  className?: string
}

interface ThreeJSElements {
  scene: THREE.Scene
  camera: THREE.OrthographicCamera
  renderer: THREE.WebGLRenderer
  backgroundPlane: THREE.Mesh
  thumbnailMeshes: THREE.Mesh[]
  textures: THREE.Texture[]
}

interface MouseTrail {
  x: number
  y: number
  timestamp: number
}

const AwardsSelection: React.FC<AwardsSelectionProps> = ({ awards, className = '' }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [mouseTrail, setMouseTrail] = useState<MouseTrail[]>([])

  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])
  const threeRef = useRef<ThreeJSElements | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const mouseVelocity = useRef<{ x: number; y: number }>({ x: 0, y: 0 })
  const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 })

  // Initialize Three.js
  const initThreeJS = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    const container = containerRef.current
    const rect = container.getBoundingClientRect()

    // Scene setup
    const scene = new THREE.Scene()

    const camera = new THREE.OrthographicCamera(
      -rect.width / 2,
      rect.width / 2,
      rect.height / 2,
      -rect.height / 2,
      1,
      1000
    )
    camera.position.z = 100

    // Enhanced renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(rect.width, rect.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    // Background plane
    const backgroundGeometry = new THREE.PlaneGeometry(rect.width, 100)
    const backgroundMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0
    })
    const backgroundPlane = new THREE.Mesh(backgroundGeometry, backgroundMaterial)
    backgroundPlane.position.z = -10
    scene.add(backgroundPlane)

    // Create thumbnail meshes
    const thumbnailMeshes: THREE.Mesh[] = []
    const textures: THREE.Texture[] = []

    awards.forEach((award, index) => {
      const textureLoader = new THREE.TextureLoader()
      const texture = textureLoader.load(award.thumbnail)
      texture.minFilter = THREE.LinearFilter
      texture.magFilter = THREE.LinearFilter
      texture.wrapS = THREE.ClampToEdgeWrapping
      texture.wrapT = THREE.ClampToEdgeWrapping
      textures.push(texture)

      const geometry = new THREE.PlaneGeometry(200, 300, 8, 12)

      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0,
        alphaTest: 0.1
      })

      const mesh = new THREE.Mesh(geometry, material)
      mesh.position.z = 10
      mesh.visible = false

      // Physics for smooth following
      mesh.userData = {
        targetPosition: new THREE.Vector3(),
        targetRotation: new THREE.Euler(),
        basePosition: new THREE.Vector3(), // NEW: Base position relative to row
        velocity: new THREE.Vector3(),
        angularVelocity: new THREE.Euler(),
        dampening: 0.25,
        rotationDampening: 0.22
      }

      thumbnailMeshes.push(mesh)
      scene.add(mesh)
    })

    threeRef.current = {
      scene,
      camera,
      renderer,
      backgroundPlane,
      thumbnailMeshes,
      textures
    }

    // Smooth render loop
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (threeRef.current) {
        threeRef.current.thumbnailMeshes.forEach((mesh) => {
          if (mesh.visible && mesh.userData) {
            // Smooth position following
            const positionDiff = mesh.userData.targetPosition.clone().sub(mesh.position)
            mesh.userData.velocity.add(positionDiff.multiplyScalar(mesh.userData.dampening))
            mesh.userData.velocity.multiplyScalar(0.92)
            mesh.position.add(mesh.userData.velocity)

            // Smooth rotation following
            const rotationDiff = new THREE.Euler().copy(mesh.userData.targetRotation)
            rotationDiff.x -= mesh.rotation.x
            rotationDiff.y -= mesh.rotation.y
            rotationDiff.z -= mesh.rotation.z

            mesh.userData.angularVelocity.x += rotationDiff.x * mesh.userData.rotationDampening
            mesh.userData.angularVelocity.y += rotationDiff.y * mesh.userData.rotationDampening
            mesh.userData.angularVelocity.z += rotationDiff.z * mesh.userData.rotationDampening

            mesh.userData.angularVelocity.x *= 0.85
            mesh.userData.angularVelocity.y *= 0.85
            mesh.userData.angularVelocity.z *= 0.85

            mesh.rotation.x += mesh.userData.angularVelocity.x
            mesh.rotation.y += mesh.userData.angularVelocity.y
            mesh.rotation.z += mesh.userData.angularVelocity.z
          }
        })

        threeRef.current.renderer.render(threeRef.current.scene, threeRef.current.camera)
      }
    }
    animate()
  }, [awards])

  // Mouse velocity calculation
  const updateMouseVelocity = useCallback(
    (e: React.MouseEvent) => {
      const currentTime = Date.now()
      const currentX = e.clientX
      const currentY = e.clientY

      const deltaX = currentX - lastMousePosition.current.x
      const deltaY = currentY - lastMousePosition.current.y
      const deltaTime = Math.max(
        16,
        currentTime - (mouseTrail[mouseTrail.length - 1]?.timestamp || currentTime)
      )

      mouseVelocity.current = {
        x: (deltaX / deltaTime) * 1000,
        y: (deltaY / deltaTime) * 1000
      }

      lastMousePosition.current = { x: currentX, y: currentY }

      const newTrail = [...mouseTrail, { x: currentX, y: currentY, timestamp: currentTime }]
      const filteredTrail = newTrail.filter((point) => currentTime - point.timestamp < 250)
      setMouseTrail(filteredTrail)
    },
    [mouseTrail]
  )

  // UPDATED: Mouse tracking that follows mouse relative to base position
  const handleMouseMove = useCallback(
    (e: React.MouseEvent, index: number) => {
      if (hoveredIndex !== index || !threeRef.current || !containerRef.current) return

      updateMouseVelocity(e)

      const { thumbnailMeshes } = threeRef.current
      const containerRect = containerRef.current.getBoundingClientRect()

      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top

      setMousePosition({ x: e.clientX, y: e.clientY })

      const mesh = thumbnailMeshes[index]
      if (!mesh || !mesh.visible) return

      // Calculate mouse offset from the base position
      const baseX = mesh.userData.basePosition.x
      const baseY = mesh.userData.basePosition.y

      // Convert mouse position to Three.js coordinates
      const mouseThreeX = mouseX - containerRect.width / 2
      const mouseThreeY = containerRect.height / 2 - mouseY

      // Calculate offset from base position (like following the mouse)
      const offsetX = (mouseThreeX - baseX) * 0.3 // Reduced factor for subtle following
      const offsetY = (mouseThreeY - baseY) * 0.3

      // Set target position as base + mouse offset
      mesh.userData.targetPosition.set(
        baseX + offsetX + 150, // Add offset to right like before
        baseY + offsetY,
        10
      )

      // Directional calculations for rotation
      const velocityMagnitude = Math.sqrt(
        mouseVelocity.current.x ** 2 + mouseVelocity.current.y ** 2
      )

      const flowDirection = Math.atan2(mouseVelocity.current.y, mouseVelocity.current.x)
      const flowIntensity = Math.min(velocityMagnitude / 800, 1)

      // 3D rotations based on offset from base position
      const baseRotationX = (offsetY / 200) * Math.PI * 0.3
      const baseRotationY = (offsetX / 200) * Math.PI * 0.3
      const flowRotationZ = flowDirection * 0.15 + flowIntensity * 0.25

      // Set target rotations
      mesh.userData.targetRotation.set(baseRotationX, baseRotationY, flowRotationZ)

      // Scale based on mouse proximity to base position
      const distanceFromBase = Math.sqrt(offsetX ** 2 + offsetY ** 2)
      const proximityScale = Math.max(0.9, 1 - (distanceFromBase / 300) * 0.1)
      const velocityScale = 1 + flowIntensity * 0.05
      const finalScale = proximityScale * velocityScale

      gsap.to(mesh.scale, {
        x: finalScale,
        y: finalScale,
        z: 1,
        duration: 0.4,
        ease: 'power2.out'
      })
    },
    [hoveredIndex, updateMouseVelocity]
  )

  // UPDATED: Background and thumbnail morphing together
  const morphBackgroundToRow = useCallback((targetIndex: number) => {
    const targetRow = rowRefs.current[targetIndex]
    if (!targetRow || !threeRef.current || !containerRef.current) return

    const { backgroundPlane, thumbnailMeshes } = threeRef.current
    const containerRect = containerRef.current.getBoundingClientRect()
    const targetRect = targetRow.getBoundingClientRect()

    const targetTop = targetRect.top - containerRect.top
    const targetHeight = targetRect.height
    const threeY = containerRect.height / 2 - (targetTop + targetHeight / 2)

            // Background morphing
        gsap.to(backgroundPlane.position, {
          y: threeY,
          duration: 0.4,
          ease: 'power2.out'
        })

        gsap.to(backgroundPlane.scale, {
          y: targetHeight / 100,
          duration: 0.4,
          ease: 'power2.out'
        })

        gsap.to(backgroundPlane.material, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out'
        })

    // UPDATED: Move thumbnail's base position to follow the background
    const currentMesh = thumbnailMeshes[targetIndex]
    if (currentMesh && currentMesh.visible) {
      // Update base position to follow the row
      currentMesh.userData.basePosition.set(0, threeY, 10)

      // Smoothly move to new base position
      gsap.to(currentMesh.userData.targetPosition, {
        x: currentMesh.userData.basePosition.x + 150,
        y: currentMesh.userData.basePosition.y,
        duration: 0.4,
        ease: 'power2.out'
      })
    }
  }, [])

  const showBackground = useCallback((targetIndex: number) => {
    const targetRow = rowRefs.current[targetIndex]
    if (!targetRow || !threeRef.current || !containerRef.current) return

    const { backgroundPlane } = threeRef.current
    const containerRect = containerRef.current.getBoundingClientRect()
    const targetRect = targetRow.getBoundingClientRect()

    const targetTop = targetRect.top - containerRect.top
    const targetHeight = targetRect.height
    const threeY = containerRect.height / 2 - (targetTop + targetHeight / 2)

    backgroundPlane.position.y = threeY
    backgroundPlane.scale.y = targetHeight / 100

    gsap.to(backgroundPlane.material, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }, [])

  const hideBackground = useCallback(() => {
    if (!threeRef.current) return

    gsap.to(threeRef.current.backgroundPlane.material, {
      opacity: 0,
      duration: 0.6,
      ease: 'power2.inOut'
    })
  }, [])

  // UPDATED: Row enter with thumbnail positioned relative to row
  const handleRowEnter = useCallback(
    (index: number, e: React.MouseEvent) => {
      const previousIndex = hoveredIndex
      setHoveredIndex(index)

      if (!threeRef.current || !containerRef.current) return

      const { thumbnailMeshes } = threeRef.current
      const containerRect = containerRef.current.getBoundingClientRect()
      const targetRow = rowRefs.current[index]

      const mouseX = e.clientX - containerRect.left
      const mouseY = e.clientY - containerRect.top

      setMousePosition({ x: e.clientX, y: e.clientY })

      // Background animation
      if (previousIndex === null) {
        showBackground(index)
      } else {
        morphBackgroundToRow(index)
      }

      // Hide previous thumbnail
      if (previousIndex !== null && previousIndex !== index) {
        const prevMesh = thumbnailMeshes[previousIndex]
        if (prevMesh) {
          gsap.to(prevMesh.scale, {
            x: 0,
            y: 0,
            z: 0,
            duration: 0.3,
            ease: 'power2.out'
          })

          gsap.to(prevMesh.material, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out',
            onComplete: () => {
              prevMesh.visible = false
              prevMesh.userData.velocity.set(0, 0, 0)
              prevMesh.userData.angularVelocity.set(0, 0, 0)
            }
          })
        }
      }

      // UPDATED: Show current thumbnail positioned relative to its row
      // COMMENTED OUT: Thumbnail display on mouse enter
      /*
      const currentMesh = thumbnailMeshes[index]
      if (currentMesh && targetRow) {
        const targetRect = targetRow.getBoundingClientRect()
        const targetTop = targetRect.top - containerRect.top
        const targetHeight = targetRect.height
        const rowThreeY = containerRect.height / 2 - (targetTop + targetHeight / 2)

        // Set base position relative to the row (like background)
        const baseX = 0 // Center horizontally
        const baseY = rowThreeY // Same Y as background

        currentMesh.userData.basePosition.set(baseX, baseY, 10)

        // Start position (base + offset to right)
        const startX = baseX + 150
        const startY = baseY

        currentMesh.position.set(startX, startY, 10)
        currentMesh.rotation.set(0, 0, 0)
        currentMesh.scale.set(0, 0, 0)
        currentMesh.visible = true

        // Set target position
        currentMesh.userData.targetPosition.set(startX, startY, 10)
        currentMesh.userData.targetRotation.set(0, 0, 0)
        currentMesh.userData.velocity.set(0, 0, 0)
        currentMesh.userData.angularVelocity.set(0, 0, 0)

        // Clean scale from 0 to 1 animation
        gsap.to(currentMesh.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.4,
          ease: 'power2.out'
        })

        gsap.to(currentMesh.material, {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out'
        })
      }
      */
    },
    [hoveredIndex, showBackground, morphBackgroundToRow]
  )

  // Container leave
  const handleContainerLeave = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !threeRef.current) return

      const container = containerRef.current
      const rect = container.getBoundingClientRect()
      const { clientX, clientY } = e

      if (
        clientX < rect.left ||
        clientX > rect.right ||
        clientY < rect.top ||
        clientY > rect.bottom
      ) {
        setHoveredIndex(null)
        setMouseTrail([])
        hideBackground()

        const { thumbnailMeshes } = threeRef.current

        thumbnailMeshes.forEach((mesh, index) => {
          if (mesh.visible) {
            const exitDirection = index % 2 === 0 ? 1 : -1

            gsap.to(mesh.scale, {
              x: 0,
              y: 0,
              z: 0,
              duration: 0.4,
              delay: index * 0.05,
              ease: 'power2.out'
            })

            gsap.to(mesh.material, {
              opacity: 0,
              duration: 0.4,
              delay: index * 0.05,
              ease: 'power2.out',
              onComplete: () => {
                mesh.visible = false
              }
            })

            gsap.to(mesh.userData.targetRotation, {
              z: exitDirection * Math.PI * 0.3,
              duration: 0.4,
              delay: index * 0.05,
              ease: 'power2.out'
            })

            gsap.to(mesh.userData.targetPosition, {
              y: mesh.position.y - 80,
              duration: 0.4,
              delay: index * 0.05,
              ease: 'power2.out'
            })
          }
        })
      }
    },
    [hideBackground]
  )

  const handleRowLeave = useCallback(
    (index: number) => {
      if (hoveredIndex !== index && threeRef.current) {
        const mesh = threeRef.current.thumbnailMeshes[index]
        if (mesh && mesh.visible) {
          gsap.to(mesh.scale, {
            x: 0.92,
            y: 0.92,
            z: 0.92,
            duration: 0.2,
            ease: 'power2.out'
          })

          gsap.to(mesh.material, {
            opacity: 0.6,
            duration: 0.2,
            ease: 'power2.out'
          })
        }
      }
    },
    [hoveredIndex]
  )

  const handleResize = useCallback(() => {
    if (!threeRef.current || !containerRef.current) return

    const { camera, renderer } = threeRef.current
    const rect = containerRef.current.getBoundingClientRect()

    camera.left = -rect.width / 2
    camera.right = rect.width / 2
    camera.top = rect.height / 2
    camera.bottom = -rect.height / 2
    camera.updateProjectionMatrix()

    renderer.setSize(rect.width, rect.height)
  }, [])

  useEffect(() => {
    initThreeJS()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)

      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (threeRef.current) {
        threeRef.current.renderer.dispose()
        threeRef.current.textures.forEach((texture) => texture.dispose())
      }
    }
  }, [initThreeJS, handleResize])

  return (
    <div
      ref={containerRef}
      className={`relative w-full bg-black text-white font-mono overflow-visible ${className}`}
      onMouseLeave={handleContainerLeave}
      style={{ height: 'auto', minHeight: '600px' }}
    >
      {/* Three.js Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 pointer-events-none"
        style={{
          zIndex: 5,
          width: '100%',
          height: '100%'
        }}
      />

      {/* Awards List */}
      <div className="relative" style={{ zIndex: 10 }}>
        {awards.map((award, index) => {
          const isHovered = hoveredIndex === index

          return (
            <div
              key={`${award.year}-${award.organization}-${index}`}
              ref={(el) => {
                rowRefs.current[index] = el
              }}
              className="pt-[20px] pb-[14px] flex justify-between items-center gap-[32px] border-b-[0.5px] border-[#6E6E6E] cursor-pointer"
              style={{
                color: isHovered ? '#000000' : 'inherit',
                position: 'relative',
                zIndex: isHovered ? 15 : 10,
                transform: isHovered ? 'translateX(6px)' : 'translateX(0px)',
                transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseEnter={(e) => handleRowEnter(index, e)}
              onMouseLeave={() => handleRowLeave(index)}
            >
              <p
                className="tq__FoundersGrotesk_22 w-3/12"
                style={{
                  color: isHovered ? '#000000' : 'inherit',
                  position: 'relative',
                  zIndex: 20,
                  transition: 'color 0.3s ease'
                }}
              >
                {award.year}
              </p>

              <p
                className="tq__FoundersGrotesk_22 w-3/12"
                style={{
                  color: isHovered ? '#000000' : 'inherit',
                  position: 'relative',
                  zIndex: 20,
                  transition: 'color 0.3s ease'
                }}
              >
                {award.organization}
              </p>

              <p
                className="tq__FoundersGrotesk_22 w-full"
                style={{
                  color: isHovered ? '#000000' : 'inherit',
                  position: 'relative',
                  zIndex: 20,
                  transition: 'color 0.3s ease'
                }}
              >
                {award.category}
              </p>
            </div>
          )
        })}
      </div>

      {/* Status Indicator */}
      {hoveredIndex !== null && (
        <div
          className="absolute right-8 top-6 text-xs px-4 py-2 rounded-full bg-white/95 text-black font-medium backdrop-blur-sm"
          style={{ zIndex: 30, transition: 'all 0.3s ease' }}
        >
          Following Mouse: {awards[hoveredIndex]?.category}
        </div>
      )}

      <div className="absolute left-8 bottom-6 text-xs text-white/40" style={{ zIndex: 20 }}>
        Thumbnail follows background position and mouse movement
      </div>
    </div>
  )
}

export default AwardsSelection
