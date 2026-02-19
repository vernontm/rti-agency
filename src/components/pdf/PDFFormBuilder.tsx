import { useState, useRef, useEffect, useCallback } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { supabase } from '../../lib/supabase'
import Card from '../ui/Card'
import Button from '../ui/Button'
import Input from '../ui/Input'
import { Upload, Trash2, Save, Type, CheckSquare, Calendar, Hash, Mail, Phone, FileText, X, ChevronLeft, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'

// Set worker path - use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

export interface PDFFormField {
  id: string
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'checkbox' | 'signature' | 'textarea'
  x: number
  y: number
  width: number
  height: number
  page: number
  required: boolean
}

interface PDFFormBuilderProps {
  onSave: (pdfUrl: string, fields: PDFFormField[], formName: string) => void
  initialPdfUrl?: string
  initialFields?: PDFFormField[]
  initialFormName?: string
}

const fieldTypes = [
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'email', icon: Mail, label: 'Email' },
  { type: 'tel', icon: Phone, label: 'Phone' },
  { type: 'number', icon: Hash, label: 'Number' },
  { type: 'date', icon: Calendar, label: 'Date' },
  { type: 'checkbox', icon: CheckSquare, label: 'Checkbox' },
  { type: 'signature', icon: FileText, label: 'Signature' },
  { type: 'textarea', icon: FileText, label: 'Text Area' },
] as const

const PDFFormBuilder = ({ onSave, initialPdfUrl, initialFields, initialFormName }: PDFFormBuilderProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(initialPdfUrl || null)
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.2)
  const [fields, setFields] = useState<PDFFormField[]>(initialFields || [])
  const [selectedField, setSelectedField] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isResizing, setIsResizing] = useState(false)
  const [formName, setFormName] = useState(initialFormName || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load PDF when URL changes
  useEffect(() => {
    if (!pdfUrl) return

    const loadPdf = async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfUrl)
        const pdf = await loadingTask.promise
        setPdfDoc(pdf)
        setTotalPages(pdf.numPages)
        setCurrentPage(1)
      } catch (error) {
        console.error('Error loading PDF:', error)
        toast.error('Failed to load PDF')
      }
    }

    loadPdf()
  }, [pdfUrl])

  // Render current page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return

    const renderPage = async () => {
      const page = await pdfDoc.getPage(currentPage)
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current!
      const context = canvas.getContext('2d')!

      canvas.height = viewport.height
      canvas.width = viewport.width

      await page.render({
        canvasContext: context,
        viewport,
        canvas: canvas,
      } as unknown as Parameters<typeof page.render>[0]).promise
    }

    renderPage()
  }, [pdfDoc, currentPage, scale])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file')
      return
    }

    setUploading(true)
    try {
      const fileName = `${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('forms')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('forms')
        .getPublicUrl(fileName)

      setPdfUrl(publicUrl)
      setFields([])
      toast.success('PDF uploaded successfully')
    } catch (error) {
      console.error('Error uploading PDF:', error)
      toast.error('Failed to upload PDF')
    } finally {
      setUploading(false)
    }
  }

  const addField = (type: PDFFormField['type']) => {
    const newField: PDFFormField = {
      id: `field_${Date.now()}`,
      name: `field_${fields.length + 1}`,
      label: `Field ${fields.length + 1}`,
      type,
      x: 50,
      y: 50,
      width: type === 'checkbox' ? 20 : type === 'textarea' || type === 'signature' ? 200 : 150,
      height: type === 'checkbox' ? 20 : type === 'textarea' || type === 'signature' ? 60 : 24,
      page: currentPage,
      required: false,
    }
    setFields([...fields, newField])
    setSelectedField(newField.id)
  }

  const updateField = (id: string, updates: Partial<PDFFormField>) => {
    setFields(fields.map(f => f.id === id ? { ...f, ...updates } : f))
  }

  const deleteField = (id: string) => {
    setFields(fields.filter(f => f.id !== id))
    if (selectedField === id) setSelectedField(null)
  }

  const handleMouseDown = useCallback((e: React.MouseEvent, fieldId: string, isResize = false) => {
    e.stopPropagation()
    const field = fields.find(f => f.id === fieldId)
    if (!field) return

    setSelectedField(fieldId)
    
    if (isResize) {
      setIsResizing(true)
    } else {
      setIsDragging(true)
      const rect = containerRef.current?.getBoundingClientRect()
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left - field.x,
          y: e.clientY - rect.top - field.y,
        })
      }
    }
  }, [fields])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!selectedField || (!isDragging && !isResizing)) return

    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const field = fields.find(f => f.id === selectedField)
    if (!field) return

    if (isDragging) {
      const newX = Math.max(0, e.clientX - rect.left - dragOffset.x)
      const newY = Math.max(0, e.clientY - rect.top - dragOffset.y)
      updateField(selectedField, { x: newX, y: newY })
    } else if (isResizing) {
      const newWidth = Math.max(20, e.clientX - rect.left - field.x)
      const newHeight = Math.max(20, e.clientY - rect.top - field.y)
      updateField(selectedField, { width: newWidth, height: newHeight })
    }
  }, [selectedField, isDragging, isResizing, dragOffset, fields])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  const handleSave = async () => {
    if (!pdfUrl) {
      toast.error('Please upload a PDF first')
      return
    }
    if (!formName.trim()) {
      toast.error('Please enter a form name')
      return
    }
    if (fields.length === 0) {
      toast.error('Please add at least one field')
      return
    }

    setSaving(true)
    try {
      await onSave(pdfUrl, fields, formName)
    } finally {
      setSaving(false)
    }
  }

  const currentPageFields = fields.filter(f => f.page === currentPage)
  const selectedFieldData = fields.find(f => f.id === selectedField)

  return (
    <div className="flex gap-6 h-[calc(100vh-200px)]">
      {/* Left sidebar - Field types */}
      <div className="w-64 flex-shrink-0 space-y-4">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Form Details</h3>
          <Input
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            placeholder="e.g., W-4 Tax Form"
          />
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-3">Add Fields</h3>
          <div className="grid grid-cols-2 gap-2">
            {fieldTypes.map(({ type, icon: Icon, label }) => (
              <button
                key={type}
                onClick={() => addField(type)}
                disabled={!pdfUrl}
                className="flex flex-col items-center gap-1 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-xs text-gray-700">{label}</span>
              </button>
            ))}
          </div>
        </Card>

        {selectedFieldData && (
          <Card>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-900">Field Properties</h3>
              <button
                onClick={() => deleteField(selectedFieldData.id)}
                className="p-1 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <Input
                label="Field Name"
                value={selectedFieldData.name}
                onChange={(e) => updateField(selectedFieldData.id, { name: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
              />
              <Input
                label="Label"
                value={selectedFieldData.label}
                onChange={(e) => updateField(selectedFieldData.id, { label: e.target.value })}
              />
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFieldData.required}
                  onChange={(e) => updateField(selectedFieldData.id, { required: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Required</span>
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                <div>X: {Math.round(selectedFieldData.x)}</div>
                <div>Y: {Math.round(selectedFieldData.y)}</div>
                <div>W: {Math.round(selectedFieldData.width)}</div>
                <div>H: {Math.round(selectedFieldData.height)}</div>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Main PDF viewer */}
      <div className="flex-1 flex flex-col">
        {!pdfUrl ? (
          <Card className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload a PDF</h3>
              <p className="text-gray-600 mb-4">Upload a PDF document to start adding fillable fields</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button onClick={() => fileInputRef.current?.click()} loading={uploading}>
                <Upload className="w-4 h-4 mr-2" />
                Select PDF
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="p-2 hover:bg-gray-100 rounded disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={0.75}>75%</option>
                  <option value={1}>100%</option>
                  <option value={1.2}>120%</option>
                  <option value={1.5}>150%</option>
                </select>
                <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm">
                  <Upload className="w-4 h-4 mr-1" />
                  Replace PDF
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* PDF Canvas with fields overlay */}
            <div className="flex-1 overflow-auto bg-gray-100 rounded-lg p-4">
              <div
                ref={containerRef}
                className="relative inline-block"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <canvas ref={canvasRef} className="shadow-lg" />
                
                {/* Field overlays */}
                {currentPageFields.map((field) => (
                  <div
                    key={field.id}
                    className={`absolute border-2 cursor-move ${
                      selectedField === field.id
                        ? 'border-blue-500 bg-blue-100/50'
                        : 'border-blue-300 bg-blue-50/30 hover:border-blue-400'
                    }`}
                    style={{
                      left: field.x,
                      top: field.y,
                      width: field.width,
                      height: field.height,
                    }}
                    onMouseDown={(e) => handleMouseDown(e, field.id)}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedField(field.id)
                    }}
                  >
                    <div className="absolute -top-5 left-0 text-xs bg-blue-500 text-white px-1 rounded whitespace-nowrap">
                      {field.label}
                    </div>
                    {selectedField === field.id && (
                      <div
                        className="absolute bottom-0 right-0 w-3 h-3 bg-blue-500 cursor-se-resize"
                        onMouseDown={(e) => handleMouseDown(e, field.id, true)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Save button */}
        {pdfUrl && (
          <div className="flex justify-end mt-4">
            <Button onClick={handleSave} loading={saving}>
              <Save className="w-4 h-4 mr-2" />
              Save Form Template
            </Button>
          </div>
        )}
      </div>

      {/* Right sidebar - Fields list */}
      <div className="w-64 flex-shrink-0">
        <Card className="h-full">
          <h3 className="font-semibold text-gray-900 mb-3">
            Fields ({fields.length})
          </h3>
          {fields.length === 0 ? (
            <p className="text-sm text-gray-500">No fields added yet</p>
          ) : (
            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {fields.map((field) => (
                <div
                  key={field.id}
                  className={`p-2 rounded-lg cursor-pointer flex items-center justify-between ${
                    selectedField === field.id
                      ? 'bg-blue-100 border border-blue-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setSelectedField(field.id)
                    setCurrentPage(field.page)
                  }}
                >
                  <div>
                    <div className="text-sm font-medium text-gray-900">{field.label}</div>
                    <div className="text-xs text-gray-500">
                      {field.type} • Page {field.page}
                      {field.required && ' • Required'}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteField(field.id)
                    }}
                    className="p-1 text-red-500 hover:bg-red-50 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default PDFFormBuilder
