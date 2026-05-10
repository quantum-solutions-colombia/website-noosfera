"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { AlertCircle, Target, CheckCircle, Code as Scope, Lightbulb, Cpu, TestTube, ArrowRight, Github, Database, Cloud, Zap, Globe, ChevronRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FrameworkSection {
  id: string
  title: string
  icon: any
  colorClass: string
  iconColor: string
  bgColor: string
  description: string
  content: string
  details: string[]
  technologies?: string[]
  highlights?: { label: string; value: string; color: string }[]
}

const frameworkSections: FrameworkSection[] = [
  {
    id: "problema",
    title: "PROBLEMA",
    icon: AlertCircle,
    colorClass: "from-red-500 to-pink-600",
    iconColor: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-950/30",
    description: "Contexto y desafíos",
    content:
      "Los datos biométricos personales representan un valor significativo pero subexplotado. Estos datos quedan atrapados sin monetización ni control del usuario.",
    details: [
      "Falta de herramientas para monetizar datos biométricos",
      "Datos dispersos sin integración centralizada",
      "Ausencia de autenticación digital verificable",
      "Oportunidad perdida en Web3",
      "Privacidad y control limitados",
    ],
    highlights: [
      { label: "Datos sin valor", value: "∞", color: "text-red-600" },
      { label: "Silos de información", value: "N/A", color: "text-pink-600" },
      { label: "Control del usuario", value: "0%", color: "text-red-500" }
    ]
  },
  {
    id: "objetivo-general",
    title: "OBJETIVO GENERAL",
    icon: Target,
    colorClass: "from-blue-500 to-cyan-600",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-950/30",
    description: "Visión principal",
    content:
      "Crear un ecosistema integral que permita monetizar patrones de ritmo cardíaco como NFTs únicos con privacidad total y escalabilidad global.",
    details: [
      "Captura automatizada en tiempo real",
      "Transformación en activos digitales verificables",
      "Integración con marketplaces globales",
      "Privacidad y control total del usuario",
      "Generación de ingresos pasivos",
    ],
    highlights: [
      { label: "Datos monetizados", value: "100%", color: "text-blue-600" },
      { label: "Control del usuario", value: "Total", color: "text-cyan-600" },
      { label: "Escalabilidad", value: "Global", color: "text-blue-500" }
    ]
  },
  {
    id: "objetivos-smart",
    title: "OBJETIVOS SMART",
    icon: CheckCircle,
    colorClass: "from-emerald-500 to-teal-600",
    iconColor: "text-emerald-600",
    bgColor: "bg-emerald-100 dark:bg-emerald-950/30",
    description: "Metas específicas y medibles",
    content: "Objetivos técnicos y comerciales cuantificables con métricas claras",
    details: [
      "Procesar 1000+ capturas/mes con <10ms latencia",
      "95%+ precisión en generación de NFTs únicos",
      "Escalar a 10k usuarios activos en Q1 2025",
      "Integración con 5+ blockchains y marketplaces",
      "MVP en producción Q4 2024",
    ],
    highlights: [
      { label: "Precisión", value: "95%+", color: "text-emerald-600" },
      { label: "Latencia", value: "<10ms", color: "text-teal-600" },
      { label: "Usuarios Q1", value: "10k+", color: "text-emerald-500" }
    ]
  },
  {
    id: "alcance",
    title: "ALCANCE DEL PROYECTO",
    icon: Scope,
    colorClass: "from-purple-500 to-violet-600",
    iconColor: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-950/30",
    description: "Límites y cobertura",
    content:
      "Noösfera se enfoca en Latinoamérica con presencia fuerte en Colombia, expandiendo globalmente a usuarios hispanohablantes.",
    details: [
      "Mercado primario: Colombia y Latinoamérica",
      "Mercado secundario: Global hispanohablante",
      "Wearables, smartwatches y sensores médicos",
      "Blockchains: Ethereum, Polygon, Solana, BSC",
      "Regulaciones: GDPR, CCPA, normativas locales",
      "Millones de transacciones diarias",
    ],
    highlights: [
      { label: "Mercado primario", value: "🇨🇴 Colombia", color: "text-yellow-600" },
      { label: "Alcance", value: "Latinoamérica", color: "text-purple-600" },
      { label: "Expansión", value: "Global", color: "text-violet-600" }
    ]
  },
  {
    id: "justificacion",
    title: "JUSTIFICACIÓN",
    icon: Lightbulb,
    colorClass: "from-amber-500 to-orange-600",
    iconColor: "text-amber-600",
    bgColor: "bg-amber-100 dark:bg-amber-950/30",
    description: "Razones y validación",
    content:
      "El mercado de NFTs crece 150% anualmente. Blockchain proporciona autenticidad verificable. Latinoamérica representa 23% del mercado cripto global.",
    details: [
      "Mercado NFT valuado en $40B+",
      "Demanda creciente de activos digitales únicos",
      "Blockchain garantiza autenticidad inmutable",
      "Datos biométricos 100% únicos",
      "Royalties pasivos indefinidos",
      "Monetización de datos generados pasivamente",
    ],
    highlights: [
      { label: "Mercado NFT", value: "$40B+", color: "text-amber-600" },
      { label: "Crecimiento anual", value: "150%", color: "text-orange-600" },
      { label: "LATAM", value: "23% Cripto", color: "text-amber-500" }
    ]
  },
  {
    id: "tecnologias",
    title: "TECNOLOGÍAS USADAS",
    icon: Cpu,
    colorClass: "from-sky-500 to-blue-600",
    iconColor: "text-sky-600",
    bgColor: "bg-sky-100 dark:bg-sky-950/30",
    description: "Stack técnico completo",
    content:
      "Arquitectura moderna: Next.js, Vercel serverless, Supabase con RLS, GitHub CI/CD, integración blockchain multi-chain.",
    details: [
      "Frontend: Next.js 16, React 19, Tailwind CSS, Framer Motion",
      "Backend: API Routes, Server Actions, Serverless Functions",
      "BD: Supabase (PostgreSQL) con Row Level Security",
      "Autenticación: Supabase Auth con 2FA",
      "Blockchain: Ethers.js, RainbowKit, OpenSea",
      "Despliegue: Vercel + GitHub CI/CD",
      "Storage: Vercel Blob, Observabilidad realtime",
    ],
    technologies: ["Next.js", "Vercel", "Supabase", "Blockchain", "GitHub"],
    highlights: [
      { label: "Despliegue", value: "Vercel", color: "text-sky-600" },
      { label: "Base de datos", value: "Supabase", color: "text-blue-600" },
      { label: "Blockchain", value: "Multi-chain", color: "text-sky-500" }
    ]
  },
  {
    id: "pruebas",
    title: "PRUEBAS",
    icon: TestTube,
    colorClass: "from-fuchsia-500 to-pink-600",
    iconColor: "text-fuchsia-600",
    bgColor: "bg-fuchsia-100 dark:bg-fuchsia-950/30",
    description: "Testing y validación",
    content:
      "Testing exhaustivo en todas las capas: unitarias, integración, e2e, seguridad y performance con cobertura >85%.",
    details: [
      "Unit Tests: Jest + React Testing Library (>85%)",
      "E2E Tests: Playwright en staging y producción",
      "Performance: Lighthouse CI, Core Web Vitals",
      "Seguridad: OWASP Top 10, penetration testing",
      "Load Testing: K6 para 10k concurrentes",
      "Blockchain Testing: Hardhat + Sepolia testnet",
      "User Testing: A/B testing de flujos principales",
    ],
    highlights: [
      { label: "Cobertura", value: ">85%", color: "text-fuchsia-600" },
      { label: "Load testing", value: "10k+", color: "text-pink-600" },
      { label: "Ambientes", value: "3+", color: "text-fuchsia-500" }
    ]
  },
]

export function TheoreticalFramework() {
  const [activeSection, setActiveSection] = useState("problema")
  const currentSection = frameworkSections.find((s) => s.id === activeSection)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 py-20">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <Badge className="mb-6 px-4 py-2 text-sm bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-950/50 dark:to-blue-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-medium">
              <Lightbulb className="mr-2 h-4 w-4 inline" />
              Marco Teórico Fundamental
            </Badge>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-7xl font-bold mt-8 leading-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Fundamentos de Noösfera
          </motion.h1>

          <motion.p
            className="text-xl text-muted-foreground mt-8 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Exploración profunda del ecosistema Noösfera. Transformamos datos biométricos 
            en activos digitales únicos, verificables y monetizables en la era Web3.
          </motion.p>
        </motion.div>

        {/* Navigation Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-20"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {frameworkSections.map((section, index) => {
              const Icon = section.icon
              const isActive = activeSection === section.id

              return (
                <motion.button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${section.colorClass} text-white shadow-xl`
                      : "bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground border border-transparent hover:border-muted"
                  }`}
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index, duration: 0.4 }}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{section.title}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Content Section */}
        <AnimatePresence mode="wait">
          {currentSection && (
            <motion.div
              key={currentSection.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-12">
                {/* Main Content Grid */}
                <motion.div
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Left: Main Card */}
                  <motion.div className="lg:col-span-2" variants={itemVariants}>
                    <div className="relative group">
                      <div className={`absolute inset-0 bg-gradient-to-r ${currentSection.colorClass} rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 blur-xl`}></div>
                      
                      <Card className="border-2 border-muted bg-background/50 backdrop-blur-sm overflow-hidden relative">
                        <div className={`h-1 bg-gradient-to-r ${currentSection.colorClass}`}></div>

                        <CardHeader className="pb-8">
                          <motion.div 
                            className="flex items-start justify-between mb-6"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className={`${currentSection.bgColor} p-4 rounded-xl`}>
                              {currentSection.icon && (
                                <currentSection.icon className={`h-8 w-8 ${currentSection.iconColor}`} />
                              )}
                            </div>
                          </motion.div>

                          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                            {currentSection.title}
                          </CardTitle>
                          <CardDescription className="text-base mt-3">
                            {currentSection.description}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-8">
                          <motion.p 
                            className="text-lg leading-relaxed text-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {currentSection.content}
                          </motion.p>

                          {/* Highlights Grid */}
                          {currentSection.highlights && (
                            <motion.div
                              className="grid grid-cols-3 gap-4"
                              variants={containerVariants}
                              initial="hidden"
                              animate="visible"
                            >
                              {currentSection.highlights.map((highlight, idx) => (
                                <motion.div
                                  key={idx}
                                  variants={itemVariants}
                                  className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-all group cursor-pointer"
                                >
                                  <p className="text-xs text-muted-foreground mb-2 group-hover:text-foreground transition-colors">
                                    {highlight.label}
                                  </p>
                                  <p className={`text-2xl font-bold ${highlight.color}`}>
                                    {highlight.value}
                                  </p>
                                </motion.div>
                              ))}
                            </motion.div>
                          )}

                          {/* Details List */}
                          <motion.div
                            className="space-y-3 pt-4 border-t border-muted"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {currentSection.details.map((detail, index) => (
                              <motion.div
                                key={index}
                                variants={itemVariants}
                                className="flex items-start gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all group cursor-pointer"
                              >
                                <ArrowRight className={`h-5 w-5 ${currentSection.iconColor} flex-shrink-0 mt-1 group-hover:translate-x-1 transition-transform`} />
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">{detail}</span>
                              </motion.div>
                            ))}
                          </motion.div>

                          {/* Technologies */}
                          {currentSection.technologies && (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="pt-6 border-t border-muted"
                            >
                              <h4 className="font-bold mb-4 flex items-center gap-2 text-foreground">
                                <Cpu className="h-5 w-5" />
                                Stack Tecnológico
                              </h4>
                              <div className="flex flex-wrap gap-3">
                                {currentSection.technologies.map((tech, index) => (
                                  <motion.div
                                    key={tech}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * index }}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                  >
                                    <Badge
                                      className="bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-950/50 dark:to-blue-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 font-semibold px-4 py-2 cursor-pointer hover:shadow-lg transition-all"
                                    >
                                      {tech}
                                    </Badge>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  </motion.div>

                  {/* Right: Side Cards */}
                  <motion.div
                    className="space-y-5"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {/* GitHub CI/CD */}
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                      <Card className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/30 dark:to-slate-900/50 border-slate-200 dark:border-slate-800 overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-200 to-transparent dark:from-slate-800 rounded-full -mr-10 -mt-10 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <CardHeader className="relative">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Github className="h-5 w-5" />
                            GitHub CI/CD
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 relative">
                          <p className="text-muted-foreground">
                            Despliegue automático en Vercel con preview en cada PR
                          </p>
                          <Badge variant="outline" className="bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700">
                            Automated
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Supabase */}
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                      <Card className="bg-gradient-to-br from-blue-50 to-cyan-50/50 dark:from-blue-950/30 dark:to-cyan-950/50 border-blue-200 dark:border-blue-800 overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-200 to-transparent dark:from-blue-800 rounded-full -mr-10 -mt-10 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <CardHeader className="relative">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Database className="h-5 w-5" />
                            Supabase + PostgreSQL
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 relative">
                          <p className="text-muted-foreground">
                            RLS, Realtime subscriptions, respaldos automáticos
                          </p>
                          <Badge variant="outline" className="bg-blue-100 dark:bg-blue-800 border-blue-300 dark:border-blue-700">
                            RLS Enabled
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Vercel Deployment */}
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50/50 dark:from-purple-950/30 dark:to-pink-950/50 border-purple-200 dark:border-purple-800 overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-200 to-transparent dark:from-purple-800 rounded-full -mr-10 -mt-10 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <CardHeader className="relative">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Cloud className="h-5 w-5" />
                            Vercel Deployment
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 relative">
                          <p className="text-muted-foreground">
                            Edge Functions, Serverless, latencia &lt;10ms global
                          </p>
                          <Badge variant="outline" className="bg-purple-100 dark:bg-purple-800 border-purple-300 dark:border-purple-700">
                            Production
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Blockchain */}
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                      <Card className="bg-gradient-to-br from-orange-50 to-red-50/50 dark:from-orange-950/30 dark:to-red-950/50 border-orange-200 dark:border-orange-800 overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200 to-transparent dark:from-orange-800 rounded-full -mr-10 -mt-10 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <CardHeader className="relative">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Zap className="h-5 w-5" />
                            Blockchain NFTs
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 relative">
                          <p className="text-muted-foreground">
                            Ethers.js, OpenSea, Multi-chain: Ethereum, Polygon, Solana, BSC
                          </p>
                          <Badge variant="outline" className="bg-orange-100 dark:bg-orange-800 border-orange-300 dark:border-orange-700">
                            Multi-chain
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>

                    {/* Colombia Scope */}
                    <motion.div variants={itemVariants} whileHover={{ y: -4 }}>
                      <Card className="bg-gradient-to-br from-yellow-50 to-amber-50/50 dark:from-yellow-950/30 dark:to-amber-950/50 border-yellow-200 dark:border-yellow-800 overflow-hidden group hover:shadow-xl transition-all">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-200 to-transparent dark:from-yellow-800 rounded-full -mr-10 -mt-10 opacity-30 group-hover:opacity-50 transition-opacity"></div>
                        <CardHeader className="relative">
                          <CardTitle className="text-lg flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Alcance: Colombia 🇨🇴
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-3 relative">
                          <p className="text-muted-foreground">
                            Mercado primario LATAM, expansión global con soporte multilingüe
                          </p>
                          <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-800 border-yellow-300 dark:border-yellow-700">
                            LATAM First
                          </Badge>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </motion.div>
                </motion.div>

                {/* Bottom Navigation */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="flex justify-between items-center pt-12 border-t border-muted"
                >
                  <motion.button
                    whileHover={{ x: -6 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const currentIndex = frameworkSections.findIndex(
                        (s) => s.id === activeSection,
                      )
                      if (currentIndex > 0) {
                        setActiveSection(frameworkSections[currentIndex - 1].id)
                      }
                    }}
                    disabled={activeSection === frameworkSections[0].id}
                    className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <ChevronRight className="h-5 w-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Anterior</span>
                  </motion.button>

                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-sm font-semibold text-muted-foreground bg-muted/50 px-6 py-3 rounded-full"
                  >
                    {frameworkSections.findIndex((s) => s.id === activeSection) + 1} de{" "}
                    {frameworkSections.length}
                  </motion.div>

                  <motion.button
                    whileHover={{ x: 6 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      const currentIndex = frameworkSections.findIndex(
                        (s) => s.id === activeSection,
                      )
                      if (currentIndex < frameworkSections.length - 1) {
                        setActiveSection(
                          frameworkSections[currentIndex + 1].id,
                        )
                      }
                    }}
                    disabled={
                      activeSection === frameworkSections[frameworkSections.length - 1].id
                    }
                    className="flex items-center gap-2 px-6 py-3 text-muted-foreground hover:text-foreground transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  >
                    <span className="font-medium">Siguiente</span>
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
