import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { supabase } from '../lib/supabase'
import {
  FileText,
  Users,
  Video,
  Bell,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'

interface PendingUser {
  id: string
  full_name: string
  email: string
  created_at: string
}

interface PendingForm {
  id: string
  form_id: string
  user_id: string
  created_at: string
  forms?: { title: string }
  users?: { full_name: string }
}

interface DashboardStats {
  pendingForms: number
  pendingUsers: number
  totalUsers: number
  activeVideos: number
  unreadAnnouncements: number
  trainingCompletion: number
  pendingUsersList: PendingUser[]
  pendingFormsList: PendingForm[]
  recentActivity: Array<{
    id: string
    type: string
    description: string
    timestamp: string
  }>
}

const DashboardPage = () => {
  const { profile } = useAuthStore()
  const navigate = useNavigate()
  const [stats, setStats] = useState<DashboardStats>({
    pendingForms: 0,
    pendingUsers: 0,
    totalUsers: 0,
    activeVideos: 0,
    unreadAnnouncements: 0,
    trainingCompletion: 0,
    pendingUsersList: [],
    pendingFormsList: [],
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const [
        { count: pendingForms },
        { count: pendingUsers },
        { count: totalUsers },
        { count: activeVideos },
        { count: unreadAnnouncements },
        { data: pendingUsersList },
        { data: pendingFormsList },
      ] = await Promise.all([
        supabase.from('form_submissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('users').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('users').select('*', { count: 'exact', head: true }),
        supabase.from('videos').select('*', { count: 'exact', head: true }),
        supabase.from('announcements').select('*', { count: 'exact', head: true }),
        supabase.from('users').select('id, full_name, email, created_at').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
        supabase.from('form_submissions').select('id, form_id, user_id, created_at, forms(title), users(full_name)').eq('status', 'pending').order('created_at', { ascending: false }).limit(5),
      ])

      setStats({
        pendingForms: pendingForms || 0,
        pendingUsers: pendingUsers || 0,
        totalUsers: totalUsers || 0,
        activeVideos: activeVideos || 0,
        unreadAnnouncements: unreadAnnouncements || 0,
        trainingCompletion: 75,
        pendingUsersList: pendingUsersList || [],
        pendingFormsList: pendingFormsList || [],
        recentActivity: [],
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ status: 'approved' })
        .eq('id', userId)
      if (error) throw error
      fetchDashboardStats()
    } catch (error) {
      console.error('Error approving user:', error)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    if (diffMins > 0) return `${diffMins}m ago`
    return 'Just now'
  }

  const isAdmin = profile?.role === 'admin'

  const statCards = [
    {
      title: 'Pending Approvals',
      value: stats.pendingUsers,
      icon: UserCheck,
      color: 'bg-red-500',
      show: isAdmin,
      urgent: stats.pendingUsers > 0,
    },
    {
      title: 'Pending Forms',
      value: stats.pendingForms,
      icon: FileText,
      color: 'bg-orange-500',
      show: isAdmin,
      urgent: stats.pendingForms > 0,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      show: isAdmin,
      urgent: false,
    },
    {
      title: 'Training Videos',
      value: stats.activeVideos,
      icon: Video,
      color: 'bg-purple-500',
      show: true,
      urgent: false,
    },
    {
      title: 'Announcements',
      value: stats.unreadAnnouncements,
      icon: Bell,
      color: 'bg-green-500',
      show: true,
      urgent: false,
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {profile?.full_name}
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your account today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards
          .filter((card) => card.show)
          .map((card) => (
            <Card key={card.title} className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {card.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${card.color}`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          ))}
      </div>

      {/* Pending Items Section */}
      {isAdmin && (stats.pendingUsers > 0 || stats.pendingForms > 0) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-amber-600" />
            <h2 className="text-lg font-semibold text-amber-900">Items Requiring Attention</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Users */}
            {stats.pendingUsersList.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Pending User Approvals</h3>
                  <button 
                    onClick={() => navigate('/admin/pending-users')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {stats.pendingUsersList.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold">
                            {user.full_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-sm text-gray-500">{formatTimeAgo(user.created_at)}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleApproveUser(user.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pending Forms */}
            {stats.pendingFormsList.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Pending Form Submissions</h3>
                  <button 
                    onClick={() => navigate('/forms')}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    View All <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-3">
                  {stats.pendingFormsList.map((form) => (
                    <div key={form.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                          <FileText className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {(form.forms as { title: string } | undefined)?.title || 'Form Submission'}
                          </p>
                          <p className="text-sm text-gray-500">
                            by {(form.users as { full_name: string } | undefined)?.full_name || 'Unknown'} • {formatTimeAgo(form.created_at)}
                          </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/forms')}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <ArrowRight className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Training Completion Rate
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${stats.trainingCompletion}%` }}
                  />
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900">
                {stats.trainingCompletion}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Overall employee training completion
            </p>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => navigate('/admin/pending-users')}
                className="flex items-center gap-2 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <UserCheck className="w-5 h-5" />
                <span className="text-sm font-medium">Review Users</span>
              </button>
              <button 
                onClick={() => navigate('/admin/videos')}
                className="flex items-center gap-2 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors"
              >
                <Video className="w-5 h-5" />
                <span className="text-sm font-medium">Upload Video</span>
              </button>
              <button 
                onClick={() => navigate('/announcements')}
                className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <Bell className="w-5 h-5" />
                <span className="text-sm font-medium">Announcements</span>
              </button>
              <button 
                onClick={() => navigate('/forms')}
                className="flex items-center gap-2 p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span className="text-sm font-medium">Review Forms</span>
              </button>
            </div>
          </Card>
        </div>
      )}

      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h2>
        {stats.recentActivity.length > 0 ? (
          <div className="space-y-4">
            {stats.recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <div className="p-2 bg-blue-100 rounded-full">
                  <Clock className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
          </div>
        )}
      </Card>
    </div>
  )
}

export default DashboardPage
