import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Card from '../components/ui/Card'
import { FileText, ChevronLeft } from 'lucide-react'
import Button from '../components/ui/Button'

interface Advisory {
  id: string
  title: string
  description: string | null
  pdf_url: string
  created_at: string
}

const AdvisoriesPage = () => {
  const [advisories, setAdvisories] = useState<Advisory[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAdvisory, setSelectedAdvisory] = useState<Advisory | null>(null)
  const location = useLocation()

  useEffect(() => {
    fetchAdvisories()
  }, [location.pathname])

  const fetchAdvisories = async () => {
    try {
      const { data, error } = await supabase
        .from('advisories')
        .select('id, title, description, pdf_url, created_at')
        .eq('is_visible', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setAdvisories(data || [])
    } catch (error) {
      console.error('Error fetching advisories:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Full-screen PDF viewer when advisory is selected
  if (selectedAdvisory) {
    return (
      <div className="h-[calc(100vh-120px)] flex flex-col">
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setSelectedAdvisory(null)}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{selectedAdvisory.title}</h2>
              {selectedAdvisory.description && (
                <p className="text-sm text-gray-500">{selectedAdvisory.description}</p>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-400">
            {new Date(selectedAdvisory.created_at).toLocaleDateString()}
          </span>
        </div>
        <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={selectedAdvisory.pdf_url}
            className="w-full h-full"
            title={selectedAdvisory.title}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Advisories</h1>
        <p className="text-gray-600">Important documents and announcements</p>
      </div>

      {advisories.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Advisories Available</h3>
          <p className="text-gray-500">Check back later for new advisories.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {advisories.map((advisory) => (
            <Card
              key={advisory.id}
              className="p-4 hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => setSelectedAdvisory(advisory)}
            >
              <div className="flex items-start gap-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                    {advisory.title}
                  </h3>
                  {advisory.description && (
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{advisory.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(advisory.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdvisoriesPage
