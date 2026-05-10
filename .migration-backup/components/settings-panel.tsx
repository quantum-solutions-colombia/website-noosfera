"use client"

import { useState } from "react"
import { Settings, Moon, Sun, Brain, AlertCircle } from "lucide-react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useNoosfera } from "@/contexts/noosfera-context"

export default function SettingsPanel() {
  const { theme, setTheme } = useTheme()
  const { config, updateConfig, resetConfig, connectionStatus } = useNoosfera()

  const [showResetAlert, setShowResetAlert] = useState(false)

  const handleNeuralSensitivityChange = (value: number[]) => {
    updateConfig({ neuralSensitivity: value[0] })
  }

  const handleProcessingSpeedChange = (value: number[]) => {
    updateConfig({ processingSpeed: value[0] })
  }

  const handleVisualizationDetailChange = (value: number[]) => {
    updateConfig({ visualizationDetail: value[0] })
  }

  const handleAutoCalibrationChange = (checked: boolean) => {
    updateConfig({ autoCalibration: checked })
  }

  const handleDataCollectionChange = (checked: boolean) => {
    updateConfig({ dataCollection: checked })
  }

  const handleAdvancedModeChange = (checked: boolean) => {
    updateConfig({ advancedMode: checked })
  }

  const handleResetConfig = () => {
    resetConfig()
    setShowResetAlert(false)
  }

  const isConnected = connectionStatus === "connected"

  return (
    <div id="settings-panel">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-emerald-500" />
            Configuración General
          </CardTitle>
          <CardDescription>Personaliza la apariencia y comportamiento del sistema</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Tema</Label>
              <div className="text-sm text-muted-foreground">Cambia entre modo claro y oscuro</div>
            </div>
            <div className="flex items-center space-x-2">
              <Sun className="h-4 w-4" />
              <Switch checked={theme === "dark"} onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")} />
              <Moon className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo Avanzado</Label>
              <div className="text-sm text-muted-foreground">Habilita funciones y visualizaciones avanzadas</div>
            </div>
            <Switch checked={config.advancedMode} onCheckedChange={handleAdvancedModeChange} />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Detalle de Visualización</Label>
              <span className="text-sm">{config.visualizationDetail}%</span>
            </div>
            <Slider
              value={[config.visualizationDetail]}
              onValueChange={handleVisualizationDetailChange}
              max={100}
              step={1}
            />
            <div className="text-xs text-muted-foreground">Ajusta el nivel de detalle en las visualizaciones</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-emerald-500" />
            Configuración de BCI
          </CardTitle>
          <CardDescription>Ajusta los parámetros de captura e interpretación neuronal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Sensibilidad Neural</Label>
                <span className="text-sm">{config.neuralSensitivity}%</span>
              </div>
              <Slider
                value={[config.neuralSensitivity]}
                onValueChange={handleNeuralSensitivityChange}
                max={100}
                step={1}
                disabled={isConnected}
              />
              <div className="text-xs text-muted-foreground">
                Ajusta la sensibilidad de captura de señales neuronales
                {isConnected && " (Desconecta el BCI para cambiar este ajuste)"}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Velocidad de Procesamiento</Label>
                <span className="text-sm">{config.processingSpeed}%</span>
              </div>
              <Slider value={[config.processingSpeed]} onValueChange={handleProcessingSpeedChange} max={100} step={1} />
              <div className="text-xs text-muted-foreground">Controla la velocidad de procesamiento de señales</div>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-calibración</Label>
                <div className="text-sm text-muted-foreground">
                  Calibra automáticamente el sistema según tus patrones neuronales
                </div>
              </div>
              <Switch
                checked={config.autoCalibration}
                onCheckedChange={handleAutoCalibrationChange}
                disabled={isConnected}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Recolección de Datos</Label>
                <div className="text-sm text-muted-foreground">
                  Permite la recolección de datos para mejorar la precisión
                </div>
              </div>
              <Switch checked={config.dataCollection} onCheckedChange={handleDataCollectionChange} />
            </div>
          </div>

          {isConnected && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Aviso</AlertTitle>
              <AlertDescription>
                Algunos ajustes están deshabilitados mientras el BCI está conectado. Desconecta el dispositivo para
                modificarlos.
              </AlertDescription>
            </Alert>
          )}

          {showResetAlert ? (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Confirmar restablecimiento</AlertTitle>
              <AlertDescription className="flex flex-col space-y-2">
                <p>¿Estás seguro de que deseas restablecer todos los ajustes a sus valores predeterminados?</p>
                <div className="flex space-x-2 mt-2">
                  <Button variant="destructive" size="sm" onClick={handleResetConfig}>
                    Sí, restablecer
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => setShowResetAlert(false)}>
                    Cancelar
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="pt-4">
              <Button variant="outline" className="w-full" onClick={() => setShowResetAlert(true)}>
                Restablecer Configuración Predeterminada
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
