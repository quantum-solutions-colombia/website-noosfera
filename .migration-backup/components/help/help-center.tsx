"use client"

import { useState } from "react"
import {
  HelpCircle,
  Search,
  Book,
  Video,
  FileQuestion,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  Brain,
  Zap,
  FileText,
  Activity,
  Settings,
  ArrowLeft,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useAuth } from "@/contexts/auth-context"
import TutorialModal from "@/components/tutorial/tutorial-modal"
import { useRouter } from "next/navigation"

export default function HelpCenter() {
  const { user, updateUser } = useAuth()
  const [showTutorial, setShowTutorial] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const startTutorial = () => {
    if (user) {
      // Marcar el tutorial como no completado para que se muestre
      updateUser({
        preferences: {
          ...user.preferences,
          tutorialCompleted: false,
        },
      })
      setShowTutorial(true)
    }
  }

  const faqs = [
    {
      question: "¿Cómo funciona la conexión BCI?",
      answer:
        "La conexión BCI (Brain-Computer Interface) utiliza sensores no invasivos para captar las señales eléctricas de tu cerebro. Estas señales son procesadas y analizadas por nuestro sistema para identificar patrones neuronales específicos. Para conectar tu dispositivo BCI, simplemente haz clic en el botón 'Conectar BCI' en el panel principal y sigue las instrucciones de calibración.",
    },
    {
      question: "¿Qué tipos de contenido puedo generar?",
      answer:
        "Actualmente, Noösfera permite generar dos tipos de contenido a partir de tus patrones neuronales: texto e imágenes. El texto generado puede variar desde descripciones breves hasta párrafos más elaborados, dependiendo de la complejidad de tus pensamientos. Las imágenes generadas son representaciones visuales abstractas basadas en tus patrones cerebrales, con diferentes estilos y niveles de detalle.",
    },
    {
      question: "¿Cómo puedo mejorar la precisión de la captura?",
      answer:
        "Para mejorar la precisión de la captura de pensamientos, te recomendamos: 1) Asegurarte de que el dispositivo BCI esté correctamente colocado, 2) Realizar la captura en un ambiente tranquilo con pocas distracciones, 3) Mantener un estado mental enfocado durante la captura, 4) Ajustar la sensibilidad neural en la configuración según tus necesidades, y 5) Practicar regularmente para mejorar tu control mental.",
    },
    {
      question: "¿Puedo exportar el contenido generado?",
      answer:
        "Sí, todo el contenido generado puede ser exportado. Para textos, puedes copiarlos al portapapeles o descargarlos como archivos de texto. Para imágenes, puedes descargarlas en formato PNG. Además, desde la Biblioteca de Contenido, puedes exportar toda tu colección en formato JSON, lo que te permite hacer copias de seguridad o transferir tu contenido a otros dispositivos.",
    },
    {
      question: "¿Qué significan las diferentes ondas cerebrales?",
      answer:
        "Noösfera analiza cuatro tipos principales de ondas cerebrales: 1) Alpha (8-13 Hz): asociadas con estados de relajación, meditación y creatividad pasiva, 2) Beta (13-30 Hz): presentes durante el estado de alerta, concentración y actividad mental, 3) Theta (4-8 Hz): aparecen durante estados de somnolencia, meditación profunda y creatividad activa, 4) Delta (0.5-4 Hz): predominantes durante el sueño profundo y estados de recuperación.",
    },
    {
      question: "¿Cómo funciona la visualización 3D de patrones?",
      answer:
        "La visualización 3D representa tus patrones neuronales como una red interconectada. Los nodos representan grupos de neuronas, mientras que las conexiones entre ellos muestran la actividad sináptica. La intensidad del color y el brillo indican el nivel de actividad, mientras que la densidad de conexiones refleja la complejidad del pensamiento. Puedes interactuar con esta visualización usando los controles de zoom, rotación y enfoque.",
    },
    {
      question: "¿Es seguro utilizar Noösfera?",
      answer:
        "Sí, Noösfera es completamente seguro. El sistema utiliza tecnología BCI no invasiva que solo lee las señales eléctricas naturales de tu cerebro, sin emitir ningún tipo de radiación o señal hacia tu cerebro. Además, todos tus datos son procesados localmente y no se comparten con terceros sin tu consentimiento explícito.",
    },
    {
      question: "¿Puedo personalizar los parámetros de generación?",
      answer:
        "Absolutamente. Noösfera ofrece varios parámetros ajustables para la generación de contenido, como la complejidad, creatividad y estilo. Estos ajustes te permiten personalizar el resultado final según tus preferencias. Además, en la sección de Configuración, puedes ajustar parámetros más avanzados como la sensibilidad neural y la velocidad de procesamiento.",
    },
  ]

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Guías rápidas implementadas con contenido real
  const quickGuides = [
    {
      id: "connection-guide",
      title: "Conexión del Dispositivo BCI",
      description: "Aprende a conectar y calibrar correctamente tu dispositivo BCI",
      icon: <Brain className="h-6 w-6 text-emerald-500" />,
      content: `
        <h2>Guía de Conexión del Dispositivo BCI</h2>
        
        <h3>Paso 1: Preparación</h3>
        <p>Asegúrate de que el dispositivo BCI esté completamente cargado y los sensores estén limpios.</p>
        
        <h3>Paso 2: Colocación</h3>
        <p>Coloca el dispositivo en tu cabeza siguiendo las marcas de posicionamiento. Los sensores principales deben estar en contacto con la frente y la parte posterior de la cabeza.</p>
        
        <h3>Paso 3: Conexión</h3>
        <p>En el panel principal de Noösfera, haz clic en el botón "Conectar BCI". El sistema iniciará automáticamente la búsqueda del dispositivo.</p>
        
        <h3>Paso 4: Calibración</h3>
        <p>Una vez conectado, el sistema entrará en modo de calibración. Sigue las instrucciones en pantalla para completar este proceso.</p>
        
        <h3>Paso 5: Verificación</h3>
        <p>Comprueba que el indicador de conexión esté en verde y que la intensidad de la señal sea superior al 70% para un rendimiento óptimo.</p>
        
        <h3>Consejos adicionales:</h3>
        <ul>
          <li>Mantén un ambiente tranquilo durante la calibración</li>
          <li>Evita movimientos bruscos que puedan desplazar los sensores</li>
          <li>Si la señal es débil, ajusta la posición del dispositivo o limpia los sensores</li>
        </ul>
      `,
    },
    {
      id: "thought-capture-guide",
      title: "Captura de Pensamientos",
      description: "Guía para capturar y procesar patrones neuronales",
      icon: <Zap className="h-6 w-6 text-blue-500" />,
      content: `
        <h2>Guía de Captura de Pensamientos</h2>
        
        <h3>Paso 1: Preparación Mental</h3>
        <p>Antes de iniciar la captura, relájate y enfoca tu mente en el pensamiento que deseas capturar. La claridad mental mejora significativamente los resultados.</p>
        
        <h3>Paso 2: Iniciar Captura</h3>
        <p>Presiona el botón "Capturar Pensamiento" en el panel principal o en el menú de acciones rápidas.</p>
        
        <h3>Paso 3: Mantén el Enfoque</h3>
        <p>Durante el proceso de captura (aproximadamente 5-10 segundos), mantén tu mente enfocada en el pensamiento. Evita distracciones externas.</p>
        
        <h3>Paso 4: Análisis de Patrones</h3>
        <p>El sistema procesará automáticamente los datos capturados y mostrará una visualización del patrón neuronal detectado.</p>
        
        <h3>Paso 5: Revisión</h3>
        <p>Examina la visualización y las métricas asociadas (complejidad, frecuencia dominante, etc.) para entender mejor tu patrón de pensamiento.</p>
        
        <h3>Técnicas avanzadas:</h3>
        <ul>
          <li>Practica la visualización mental para mejorar la claridad de los patrones</li>
          <li>Experimenta con diferentes tipos de pensamientos (abstractos, concretos, emocionales)</li>
          <li>Utiliza la respiración controlada para estabilizar tu estado mental</li>
        </ul>
      `,
    },
    {
      id: "content-generation-guide",
      title: "Generación de Contenido",
      description: "Cómo transformar pensamientos en texto e imágenes",
      icon: <FileText className="h-6 w-6 text-violet-500" />,
      content: `
        <h2>Guía de Generación de Contenido</h2>
        
        <h3>Paso 1: Captura Previa</h3>
        <p>Antes de generar contenido, asegúrate de haber capturado un patrón de pensamiento. El botón de generación estará desactivado hasta que haya un patrón disponible.</p>
        
        <h3>Paso 2: Selección de Tipo</h3>
        <p>En la sección de Generación de Contenido, selecciona el tipo de contenido que deseas crear: texto o imagen.</p>
        
        <h3>Paso 3: Ajuste de Parámetros</h3>
        <p>Personaliza los parámetros de generación según tus preferencias:</p>
        <ul>
          <li><strong>Complejidad:</strong> Determina la profundidad y detalle del contenido</li>
          <li><strong>Creatividad:</strong> Controla el nivel de variabilidad y originalidad</li>
          <li><strong>Estilo:</strong> Para imágenes, selecciona entre estilos visuales predefinidos</li>
        </ul>
        
        <h3>Paso 4: Generación</h3>
        <p>Presiona el botón "Generar" y espera mientras el sistema procesa el patrón neuronal y crea el contenido.</p>
        
        <h3>Paso 5: Revisión y Exportación</h3>
        <p>Una vez generado, puedes revisar el contenido, guardarlo en tu biblioteca o exportarlo directamente.</p>
        
        <h3>Consejos para mejores resultados:</h3>
        <ul>
          <li>Los patrones más complejos suelen generar contenido más detallado</li>
          <li>Experimenta con diferentes combinaciones de parámetros</li>
          <li>Para textos más coherentes, mantén un enfoque claro durante la captura</li>
          <li>Las imágenes abstractas funcionan mejor con pensamientos conceptuales</li>
        </ul>
      `,
    },
    {
      id: "visualization-guide",
      title: "Visualización y Análisis",
      description: "Interpreta las visualizaciones 3D y gráficos de ondas cerebrales",
      icon: <Activity className="h-6 w-6 text-amber-500" />,
      content: `
        <h2>Guía de Visualización y Análisis</h2>
        
        <h3>Paso 1: Acceso a Visualizaciones</h3>
        <p>Navega a la sección "Visualizar" en el menú principal para acceder a las herramientas de visualización avanzada.</p>
        
        <h3>Paso 2: Exploración 3D</h3>
        <p>En la visualización 3D de patrones neuronales:</p>
        <ul>
          <li>Utiliza los controles de zoom para acercarte a áreas específicas</li>
          <li>Rota la visualización para examinarla desde diferentes ángulos</li>
          <li>Observa las conexiones brillantes que indican mayor actividad</li>
        </ul>
        
        <h3>Paso 3: Análisis de Ondas</h3>
        <p>En la sección de ondas cerebrales:</p>
        <ul>
          <li>Selecciona entre los diferentes tipos de ondas (Alpha, Beta, Theta, Delta)</li>
          <li>Observa los patrones y picos en la actividad</li>
          <li>Compara la intensidad relativa de cada tipo de onda</li>
        </ul>
        
        <h3>Paso 4: Interpretación de Métricas</h3>
        <p>Analiza las métricas clave proporcionadas:</p>
        <ul>
          <li><strong>Complejidad:</strong> Indica la riqueza y detalle del patrón</li>
          <li><strong>Estabilidad:</strong> Muestra la consistencia del patrón a lo largo del tiempo</li>
          <li><strong>Frecuencia Dominante:</strong> Revela el tipo de actividad mental predominante</li>
        </ul>
        
        <h3>Paso 5: Comparación Histórica</h3>
        <p>Utiliza la línea de tiempo para comparar patrones actuales con capturas anteriores y observar tendencias.</p>
        
        <h3>Interpretación avanzada:</h3>
        <ul>
          <li>Alta actividad Alpha suele indicar estados meditativos o creativos</li>
          <li>Predominancia Beta se asocia con concentración y resolución de problemas</li>
          <li>Patrones con alta densidad de conexiones reflejan pensamientos complejos</li>
          <li>La simetría en la visualización 3D puede indicar equilibrio mental</li>
        </ul>
      `,
    },
    {
      id: "advanced-settings-guide",
      title: "Configuración Avanzada",
      description: "Personaliza el sistema para optimizar tu experiencia",
      icon: <Settings className="h-6 w-6 text-emerald-500" />,
      content: `
        <h2>Guía de Configuración Avanzada</h2>
        
        <h3>Paso 1: Acceso a Configuración</h3>
        <p>Navega a la sección "Configuración" desde el menú principal para acceder a todos los ajustes personalizables.</p>
        
        <h3>Paso 2: Ajustes de Captura</h3>
        <p>Personaliza los parámetros de captura neural:</p>
        <ul>
          <li><strong>Sensibilidad Neural:</strong> Ajusta la sensibilidad de los sensores (valores más altos captan señales más sutiles)</li>
          <li><strong>Duración de Captura:</strong> Modifica el tiempo de captura según tus necesidades</li>
          <li><strong>Filtrado de Ruido:</strong> Controla el nivel de filtrado de señales no deseadas</li>
        </ul>
        
        <h3>Paso 3: Ajustes de Procesamiento</h3>
        <p>Configura cómo se procesan los datos capturados:</p>
        <ul>
          <li><strong>Velocidad de Procesamiento:</strong> Equilibra entre velocidad y precisión</li>
          <li><strong>Profundidad de Análisis:</strong> Determina cuán detallado será el análisis</li>
          <li><strong>Calibración Automática:</strong> Activa/desactiva la calibración automática del sistema</li>
        </ul>
        
        <h3>Paso 4: Personalización Visual</h3>
        <p>Adapta la interfaz a tus preferencias:</p>
        <ul>
          <li><strong>Tema:</strong> Selecciona entre modo claro, oscuro o automático</li>
          <li><strong>Detalle de Visualización:</strong> Ajusta el nivel de detalle en las representaciones visuales</li>
          <li><strong>Animaciones:</strong> Controla la intensidad de las animaciones del sistema</li>
        </ul>
        
        <h3>Paso 5: Gestión de Datos</h3>
        <p>Configura cómo se manejan tus datos:</p>
        <ul>
          <li><strong>Almacenamiento Local:</strong> Define límites de almacenamiento</li>
          <li><strong>Copias de Seguridad:</strong> Configura la frecuencia de respaldos automáticos</li>
          <li><strong>Privacidad:</strong> Ajusta qué datos se recopilan para mejorar el sistema</li>
        </ul>
        
        <h3>Configuraciones recomendadas:</h3>
        <ul>
          <li>Para principiantes: sensibilidad media, alta velocidad de procesamiento, calibración automática activada</li>
          <li>Para usuarios avanzados: alta sensibilidad, procesamiento profundo, ajustes manuales de calibración</li>
          <li>Para rendimiento óptimo: equilibra la sensibilidad y velocidad según tu hardware específico</li>
        </ul>
      `,
    },
  ]

  // Tutoriales en video implementados
  const videoTutorials = [
    {
      id: "video-intro",
      title: "Introducción a Noösfera",
      duration: "5:32",
      thumbnail: "/tutorial/video-intro.jpg",
      description: "Una visión general del sistema Noösfera y sus capacidades principales",
      content: `
        <div class="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
          <div class="text-center p-6">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 class="text-lg font-medium mb-2">Introducción a Noösfera</h3>
            <p class="text-sm text-muted-foreground mb-4">Duración: 5:32</p>
            <p class="text-sm text-muted-foreground">Este video presenta una visión general del sistema Noösfera, explicando sus fundamentos, capacidades principales y cómo puede transformar tu interacción con la tecnología mediante la interpretación de patrones neuronales.</p>
          </div>
        </div>
        
        <h3>Contenido del video:</h3>
        <ul class="space-y-2 mt-4">
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Introducción al concepto de interfaz cerebro-computadora</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Demostración de las capacidades principales de Noösfera</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Visión general de la interfaz de usuario</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Primeros pasos para comenzar a utilizar el sistema</span>
          </li>
        </ul>
      `,
    },
    {
      id: "video-patterns",
      title: "Captura y Análisis de Patrones",
      duration: "8:47",
      thumbnail: "/tutorial/video-patterns.jpg",
      description: "Aprende a capturar y analizar patrones neuronales de manera efectiva",
      content: `
        <div class="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
          <div class="text-center p-6">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 class="text-lg font-medium mb-2">Captura y Análisis de Patrones</h3>
            <p class="text-sm text-muted-foreground mb-4">Duración: 8:47</p>
            <p class="text-sm text-muted-foreground">Este tutorial detalla el proceso de captura de patrones neuronales, explicando las técnicas para obtener señales de alta calidad y cómo interpretar los diferentes tipos de visualizaciones y métricas proporcionadas por el sistema.</p>
          </div>
        </div>
        
        <h3>Contenido del video:</h3>
        <ul class="space-y-2 mt-4">
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Preparación mental para la captura de patrones</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Técnicas para mejorar la calidad de las señales</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Interpretación de visualizaciones 3D y gráficos de ondas</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Análisis de métricas y patrones recurrentes</span>
          </li>
        </ul>
      `,
    },
    {
      id: "video-content",
      title: "Generación Avanzada de Contenido",
      duration: "7:15",
      thumbnail: "/tutorial/video-content.jpg",
      description: "Técnicas avanzadas para generar contenido de alta calidad",
      content: `
        <div class="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
          <div class="text-center p-6">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 class="text-lg font-medium mb-2">Generación Avanzada de Contenido</h3>
            <p class="text-sm text-muted-foreground mb-4">Duración: 7:15</p>
            <p class="text-sm text-muted-foreground">Este tutorial profundiza en las técnicas avanzadas para generar contenido de alta calidad a partir de patrones neuronales, incluyendo la optimización de parámetros y estrategias para diferentes tipos de contenido.</p>
          </div>
        </div>
        
        <h3>Contenido del video:</h3>
        <ul class="space-y-2 mt-4">
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Optimización de parámetros para diferentes tipos de contenido</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Técnicas para generar textos coherentes y estructurados</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Estrategias para crear imágenes visualmente impactantes</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Personalización y refinamiento del contenido generado</span>
          </li>
        </ul>
      `,
    },
    {
      id: "video-brainwaves",
      title: "Interpretación de Ondas Cerebrales",
      duration: "10:23",
      thumbnail: "/tutorial/video-brainwaves.jpg",
      description: "Comprende los diferentes tipos de ondas cerebrales y su significado",
      content: `
        <div class="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
          <div class="text-center p-6">
            <Video className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 class="text-lg font-medium mb-2">Interpretación de Ondas Cerebrales</h3>
            <p class="text-sm text-muted-foreground mb-4">Duración: 10:23</p>
            <p class="text-sm text-muted-foreground">Este tutorial profundiza en los diferentes tipos de ondas cerebrales (Alpha, Beta, Theta, Delta), explicando su significado, características y cómo interpretar los patrones que aparecen en las visualizaciones del sistema.</p>
          </div>
        </div>
        
        <h3>Contenido del video:</h3>
        <ul class="space-y-2 mt-4">
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Características y significado de cada tipo de onda cerebral</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Relación entre estados mentales y patrones de ondas</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Técnicas para identificar y analizar patrones específicos</span>
          </li>
          <li class="flex items-start gap-2">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-1 rounded-full mt-0.5">
              <svg class="h-2 w-2 text-blue-500" fill="currentColor" viewBox="0 0 8 8">
                <circle cx="4" cy="4" r="3" />
              </svg>
            </div>
            <span>Aplicaciones prácticas del análisis de ondas cerebrales</span>
          </li>
        </ul>
      `,
    },
  ]

  // Estado para guías y videos
  const [selectedGuide, setSelectedGuide] = useState<string | null>(null)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  // Encontrar la guía o video seleccionado
  const currentGuide = quickGuides.find((guide) => guide.id === selectedGuide)
  const currentVideo = videoTutorials.find((video) => video.id === selectedVideo)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Botón para regresar al dashboard */}
      <Button variant="outline" onClick={() => router.push("/dashboard")} className="mb-6 flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Regresar al Dashboard
      </Button>

      <Card className="border-none shadow-lg bg-gradient-to-br from-background to-muted/50 mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <HelpCircle className="h-6 w-6 text-emerald-500" />
            Centro de Ayuda
          </CardTitle>
          <CardDescription>Encuentra respuestas, guías y recursos para aprovechar al máximo Noösfera</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar en la ayuda..."
              className="w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-full mb-3">
                  <Book className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-medium mb-1">Guías Rápidas</h3>
                <p className="text-sm text-muted-foreground mb-3">Instrucciones paso a paso para comenzar</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-emerald-200 dark:border-emerald-900/50"
                  onClick={() => document.getElementById("quick-guides")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Ver Guías
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-blue-100 dark:bg-blue-900/50 p-3 rounded-full mb-3">
                  <Video className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-medium mb-1">Tutoriales en Video</h3>
                <p className="text-sm text-muted-foreground mb-3">Aprende visualmente con nuestros videos</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-blue-200 dark:border-blue-900/50"
                  onClick={() => document.getElementById("video-tutorials")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Ver Videos
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-900/50">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="bg-violet-100 dark:bg-violet-900/50 p-3 rounded-full mb-3">
                  <FileQuestion className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-medium mb-1">Preguntas Frecuentes</h3>
                <p className="text-sm text-muted-foreground mb-3">Respuestas a las dudas más comunes</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-violet-200 dark:border-violet-900/50"
                  onClick={() => document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Ver FAQs
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-muted/30 p-4 rounded-lg border flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-full">
                <Brain className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="font-medium">Tutorial Interactivo</h3>
                <p className="text-sm text-muted-foreground">Aprende a usar Noösfera paso a paso</p>
              </div>
            </div>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={startTutorial}>
              Iniciar Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Si hay una guía o video seleccionado, mostrar su contenido */}
      {(selectedGuide || selectedVideo) && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {currentGuide?.icon || currentVideo?.icon || <FileText className="h-5 w-5 text-emerald-500" />}
                <CardTitle>{currentGuide?.title || currentVideo?.title}</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedGuide(null)
                  setSelectedVideo(null)
                }}
              >
                Volver
              </Button>
            </div>
            <CardDescription>{currentGuide?.description || currentVideo?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm md:prose-base dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: currentGuide?.content || currentVideo?.content || "" }}
            />
          </CardContent>
        </Card>
      )}

      {/* Si no hay guía o video seleccionado, mostrar las pestañas normales */}
      {!selectedGuide && !selectedVideo && (
        <Tabs defaultValue="guides">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="guides">Guías Rápidas</TabsTrigger>
            <TabsTrigger value="videos">Tutoriales en Video</TabsTrigger>
            <TabsTrigger value="faqs">Preguntas Frecuentes</TabsTrigger>
          </TabsList>

          <TabsContent value="guides" id="quick-guides">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickGuides.map((guide) => (
                <Card key={guide.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {guide.icon}
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{guide.description}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-between"
                      onClick={() => setSelectedGuide(guide.id)}
                    >
                      <span>Ver guía</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="videos" id="video-tutorials">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {videoTutorials.map((video) => (
                <Card key={video.id} className="overflow-hidden">
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `/placeholder.svg?height=200&width=400&text=${encodeURIComponent(video.title)}`
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                        <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{video.description}</p>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-between"
                      onClick={() => setSelectedVideo(video.id)}
                    >
                      <span>Ver video</span>
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="faqs" id="faqs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileQuestion className="h-5 w-5 text-emerald-500" />
                  Preguntas Frecuentes
                </CardTitle>
                <CardDescription>Respuestas a las preguntas más comunes sobre Noösfera</CardDescription>
              </CardHeader>
              <CardContent>
                {searchQuery && filteredFaqs.length === 0 ? (
                  <div className="text-center py-8">
                    <FileQuestion className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">No se encontraron resultados para "{searchQuery}"</p>
                    <Button variant="link" onClick={() => setSearchQuery("")} className="mt-2">
                      Limpiar búsqueda
                    </Button>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {(searchQuery ? filteredFaqs : faqs).map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-between">
                <p className="text-sm text-muted-foreground">¿No encuentras lo que buscas?</p>
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <a href="#contact-support">
                    <MessageCircle className="h-4 w-4" />
                    Contactar Soporte
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {showTutorial && <TutorialModal onClose={() => setShowTutorial(false)} />}
    </div>
  )
}
