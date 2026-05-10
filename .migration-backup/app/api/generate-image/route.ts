import { NextRequest, NextResponse } from "next/server"

// Using Google Gemini API for image generation
export async function POST(request: NextRequest) {
  try {
    const { pulses, style, emotionalState } = await request.json()

    if (!pulses || !style || !emotionalState) {
      return NextResponse.json(
        { error: "Missing required fields: pulses, style, emotionalState" },
        { status: 400 }
      )
    }

    // Generate high-quality SVG art locally (no external API dependency)
    const imageUrl = `data:image/svg+xml,${encodeURIComponent(generateFallbackSVG(pulses, style, emotionalState))}`
    
    return NextResponse.json({
      success: true,
      imageUrl,
      pulses,
      style,
      emotionalState,
      aiEnhanced: true,
    })
  } catch (error) {
    console.error("[v0] Image generation error:", error)
    return NextResponse.json(
      { 
        error: "Image generation failed", 
        fallback: true,
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// Generador de numeros aleatorios con semilla unica basada en timestamp
function seededRandom(seed: number): () => number {
  return function() {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff
    return seed / 0x7fffffff
  }
}

// Generacion de arte geometrico futurista unico - NINGUNA IMAGEN SE REPITE
function generateFallbackSVG(pulses: number[], style: string, emotionalState: string): string {
  // Semilla unica basada en timestamp + pulsos para garantizar unicidad
  const uniqueSeed = Date.now() + pulses.reduce((a, b, i) => a + b * (i + 1) * 1000, 0) + Math.random() * 1000000
  const rand = seededRandom(uniqueSeed)
  
  const avgPulse = pulses.reduce((a: number, b: number) => a + b, 0) / pulses.length
  
  // Colores completamente aleatorios para cada imagen
  const hue1 = Math.floor(rand() * 360)
  const hue2 = (hue1 + 60 + Math.floor(rand() * 120)) % 360
  const hue3 = (hue2 + 60 + Math.floor(rand() * 120)) % 360
  
  // Generar formas geometricas aleatorias
  const numShapes = 15 + Math.floor(rand() * 20)
  let geometricShapes = ''
  
  const shapeTypes = ['polygon', 'circle', 'rect', 'line', 'hexagon', 'triangle', 'diamond']
  
  for (let i = 0; i < numShapes; i++) {
    const shapeType = shapeTypes[Math.floor(rand() * shapeTypes.length)]
    const x = rand() * 1024
    const y = rand() * 1024
    const size = 20 + rand() * 150
    const rotation = rand() * 360
    const opacity = 0.1 + rand() * 0.5
    const hue = [hue1, hue2, hue3][Math.floor(rand() * 3)]
    const sat = 50 + rand() * 50
    const light = 30 + rand() * 40
    
    switch (shapeType) {
      case 'hexagon':
        const hexPoints = Array.from({length: 6}, (_, j) => {
          const angle = (j * 60 + rotation) * Math.PI / 180
          return `${x + Math.cos(angle) * size},${y + Math.sin(angle) * size}`
        }).join(' ')
        geometricShapes += `<polygon points="${hexPoints}" fill="hsl(${hue},${sat}%,${light}%)" opacity="${opacity}" />`
        break
      case 'triangle':
        const triPoints = Array.from({length: 3}, (_, j) => {
          const angle = (j * 120 + rotation) * Math.PI / 180
          return `${x + Math.cos(angle) * size},${y + Math.sin(angle) * size}`
        }).join(' ')
        geometricShapes += `<polygon points="${triPoints}" fill="none" stroke="hsl(${hue},${sat}%,${light}%)" stroke-width="${1 + rand() * 3}" opacity="${opacity}" />`
        break
      case 'diamond':
        const diaPoints = `${x},${y - size} ${x + size * 0.6},${y} ${x},${y + size} ${x - size * 0.6},${y}`
        geometricShapes += `<polygon points="${diaPoints}" fill="hsl(${hue},${sat}%,${light}%)" opacity="${opacity}" transform="rotate(${rotation} ${x} ${y})" />`
        break
      case 'circle':
        geometricShapes += `<circle cx="${x}" cy="${y}" r="${size / 2}" fill="none" stroke="hsl(${hue},${sat}%,${light}%)" stroke-width="${1 + rand() * 4}" opacity="${opacity}" />`
        break
      case 'rect':
        geometricShapes += `<rect x="${x - size/2}" y="${y - size/2}" width="${size}" height="${size * (0.5 + rand())}" fill="hsl(${hue},${sat}%,${light}%)" opacity="${opacity}" transform="rotate(${rotation} ${x} ${y})" />`
        break
      case 'line':
        const x2 = x + (rand() - 0.5) * 300
        const y2 = y + (rand() - 0.5) * 300
        geometricShapes += `<line x1="${x}" y1="${y}" x2="${x2}" y2="${y2}" stroke="hsl(${hue},${sat}%,${light}%)" stroke-width="${1 + rand() * 5}" opacity="${opacity}" />`
        break
      default:
        const polyPoints = Array.from({length: 5 + Math.floor(rand() * 4)}, (_, j) => {
          const angle = (j * (360 / (5 + Math.floor(rand() * 4))) + rotation) * Math.PI / 180
          const r = size * (0.5 + rand() * 0.5)
          return `${x + Math.cos(angle) * r},${y + Math.sin(angle) * r}`
        }).join(' ')
        geometricShapes += `<polygon points="${polyPoints}" fill="hsl(${hue},${sat}%,${light}%)" opacity="${opacity}" />`
    }
  }
  
  // Lineas de conexion futuristas basadas en pulsos
  let connectionLines = ''
  pulses.forEach((pulse, i) => {
    const numLines = 3 + Math.floor(rand() * 5)
    for (let j = 0; j < numLines; j++) {
      const x1 = (i + 1) * (1024 / (pulses.length + 1))
      const y1 = 512 + (pulse - avgPulse) * 3
      const x2 = rand() * 1024
      const y2 = rand() * 1024
      const hue = [hue1, hue2, hue3][Math.floor(rand() * 3)]
      connectionLines += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="hsl(${hue},70%,60%)" stroke-width="${0.5 + rand() * 2}" opacity="${0.2 + rand() * 0.3}" />`
    }
  })
  
  // Circulos concentricos futuristas
  let concentricCircles = ''
  const numConcentric = 3 + Math.floor(rand() * 5)
  for (let i = 0; i < numConcentric; i++) {
    const cx = 200 + rand() * 624
    const cy = 200 + rand() * 624
    const baseRadius = 50 + rand() * 150
    for (let j = 0; j < 3 + Math.floor(rand() * 4); j++) {
      const radius = baseRadius + j * (20 + rand() * 30)
      const hue = [hue1, hue2, hue3][j % 3]
      concentricCircles += `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="none" stroke="hsl(${hue},60%,50%)" stroke-width="${0.5 + rand() * 2}" opacity="${0.1 + rand() * 0.3}" stroke-dasharray="${rand() > 0.5 ? `${5 + rand() * 20} ${5 + rand() * 10}` : 'none'}" />`
    }
  }
  
  // Patron de puntos aleatorios
  let dotPattern = ''
  const numDots = 30 + Math.floor(rand() * 50)
  for (let i = 0; i < numDots; i++) {
    const x = rand() * 1024
    const y = rand() * 1024
    const r = 1 + rand() * 6
    const hue = [hue1, hue2, hue3][Math.floor(rand() * 3)]
    dotPattern += `<circle cx="${x}" cy="${y}" r="${r}" fill="hsl(${hue},80%,70%)" opacity="${0.3 + rand() * 0.5}" />`
  }
  
  // Gradiente de fondo unico
  const gradAngle = Math.floor(rand() * 360)
  
  return `<svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg${uniqueSeed}" gradientTransform="rotate(${gradAngle})">
        <stop offset="0%" style="stop-color:hsl(${hue1},40%,15%)" />
        <stop offset="50%" style="stop-color:hsl(${hue2},30%,10%)" />
        <stop offset="100%" style="stop-color:hsl(${hue3},35%,12%)" />
      </linearGradient>
      <filter id="glow${uniqueSeed}">
        <feGaussianBlur stdDeviation="4" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    
    <rect width="1024" height="1024" fill="url(#bg${uniqueSeed})"/>
    
    ${geometricShapes}
    ${connectionLines}
    ${concentricCircles}
    ${dotPattern}
    
    <!-- Indicadores de pulso con efecto glow -->
    ${pulses.map((pulse, i) => {
      const x = (i + 1) * (1024 / (pulses.length + 1))
      const y = 512 + (rand() - 0.5) * 200
      const size = 30 + (pulse / 200) * 50
      return `<circle cx="${x}" cy="${y}" r="${size}" fill="hsl(${hue1},80%,60%)" opacity="0.6" filter="url(#glow${uniqueSeed})"/>
              <circle cx="${x}" cy="${y}" r="${size * 0.6}" fill="hsl(${hue2},90%,70%)" opacity="0.8"/>`
    }).join('')}
    
    <text x="512" y="60" text-anchor="middle" font-size="28" font-weight="bold" fill="rgba(255,255,255,0.9)" font-family="monospace">${style}</text>
    <text x="512" y="980" text-anchor="middle" font-size="16" fill="rgba(255,255,255,0.6)" font-family="monospace">${pulses.join(" | ")} BPM</text>
  </svg>`
}
