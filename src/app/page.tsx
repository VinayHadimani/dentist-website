'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import {
  CalendarIcon,
  Clock,
  Mail,
  MapPin,
  Phone,
  Star,
  Shield,
  Heart,
  Award,
  Sparkles,
  User,
  Stethoscope,
  MessageSquare,
  Settings,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock4,
  Trash2,
  Lock,
  LogOut,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'

const services = [
  {
    id: 'general-checkup',
    name: 'General Checkup',
    description: 'Comprehensive dental examination and cleaning',
    price: '$80',
  },
  {
    id: 'teeth-whitening',
    name: 'Teeth Whitening',
    description: 'Professional whitening treatment for a brighter smile',
    price: '$250',
  },
  {
    id: 'dental-implants',
    name: 'Dental Implants',
    description: 'Permanent solution for missing teeth',
    price: '$1,500+',
  },
  {
    id: 'root-canal',
    name: 'Root Canal',
    description: 'Pain-free root canal treatment',
    price: '$400',
  },
  {
    id: 'orthodontics',
    name: 'Orthodontics',
    description: 'Braces and aligners for straighter teeth',
    price: '$3,000+',
  },
  {
    id: 'emergency',
    name: 'Emergency Care',
    description: 'Urgent dental care when you need it most',
    price: 'Varies',
  },
]

const timeSlots = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
]

interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  service: string
  date: string
  time: string
  message: string | null
  status: string
  createdAt: string
}

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700 border-amber-200', icon: <Clock4 className="w-3 h-3" /> },
  confirmed: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: <CheckCircle className="w-3 h-3" /> },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: <CheckCircle className="w-3 h-3" /> },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200', icon: <XCircle className="w-3 h-3" /> },
}

export default function Home() {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [selectedService, setSelectedService] = useState<string>('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const { toast } = useToast()

  // Check if already authenticated on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/session')
      const data = await response.json()
      setIsAuthenticated(data.authenticated)
    } catch (error) {
      setIsAuthenticated(false)
    }
  }

  const handleLogin = async () => {
    if (!password) {
      toast({
        title: 'Error',
        description: 'Please enter the admin password.',
        variant: 'destructive',
      })
      return
    }

    setIsLoggingIn(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (response.ok) {
        setIsAuthenticated(true)
        setPassword('')
        toast({
          title: 'Welcome, Doctor!',
          description: 'You are now logged in to the admin panel.',
        })
        fetchAppointments()
      } else {
        toast({
          title: 'Access Denied',
          description: data.error || 'Invalid password.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to log in. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsAuthenticated(false)
      setAppointments([])
      setIsAdminOpen(false)
      toast({
        title: 'Logged Out',
        description: 'You have been logged out successfully.',
      })
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const fetchAppointments = async () => {
    setIsLoadingAppointments(true)
    try {
      const response = await fetch('/api/appointments')
      const data = await response.json()
      if (response.ok) {
        setAppointments(data.appointments)
      } else {
        if (response.status === 401) {
          setIsAuthenticated(false)
          toast({
            title: 'Session Expired',
            description: 'Please log in again.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      console.error('Error fetching appointments:', error)
    } finally {
      setIsLoadingAppointments(false)
    }
  }

  useEffect(() => {
    if (isAdminOpen && isAuthenticated) {
      fetchAppointments()
    }
  }, [isAdminOpen, isAuthenticated])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!date || !selectedTime || !selectedService || !name || !email || !phone) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: name,
          patientEmail: email,
          patientPhone: phone,
          service: selectedService,
          date: format(date, 'yyyy-MM-dd'),
          time: selectedTime,
          message,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: 'Appointment Booked!',
          description: `Your appointment has been scheduled for ${format(date, 'MMMM d, yyyy')} at ${selectedTime}.`,
        })
        // Reset form
        setDate(undefined)
        setSelectedTime('')
        setSelectedService('')
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to book appointment. Please try again.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book appointment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        toast({
          title: 'Status Updated',
          description: `Appointment marked as ${newStatus}.`,
        })
        fetchAppointments()
      } else {
        if (response.status === 401) {
          setIsAuthenticated(false)
          toast({
            title: 'Session Expired',
            description: 'Please log in again.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error',
            description: 'Failed to update status.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update status.',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to delete this appointment?')) return

    try {
      const response = await fetch(`/api/appointments/${appointmentId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast({
          title: 'Appointment Deleted',
          description: 'The appointment has been removed.',
        })
        fetchAppointments()
      } else {
        if (response.status === 401) {
          setIsAuthenticated(false)
          toast({
            title: 'Session Expired',
            description: 'Please log in again.',
            variant: 'destructive',
          })
        } else {
          toast({
            title: 'Error',
            description: 'Failed to delete appointment.',
            variant: 'destructive',
          })
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete appointment.',
        variant: 'destructive',
      })
    }
  }

  const getServiceName = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    return service ? service.name : serviceId
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-white">
      {/* Admin Button - Floating */}
      <Dialog open={isAdminOpen} onOpenChange={setIsAdminOpen}>
        <DialogTrigger asChild>
          <Button
            className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg bg-emerald-700 hover:bg-emerald-800"
            size="icon"
            title="Admin Panel"
          >
            <Settings className="w-6 h-6" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {isAuthenticated ? 'Admin Dashboard - Appointments' : 'Admin Login'}
              </span>
              {isAuthenticated && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchAppointments}
                    disabled={isLoadingAppointments}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoadingAppointments ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {/* Login Form */}
          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900">Doctor Access Only</h3>
                <p className="text-sm text-gray-500 mt-1">Enter the admin password to view appointments</p>
              </div>
              <div className="w-full max-w-sm space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Admin Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={handleLogin}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Logging in...' : 'Login'}
                </Button>
              </div>
            </div>
          ) : (
            /* Appointments List */
            <div className="flex-1 overflow-y-auto mt-4">
              {isLoadingAppointments ? (
                <div className="flex items-center justify-center py-8">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-600" />
                </div>
              ) : appointments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No appointments found. Book your first appointment!
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <Card key={appointment.id} className="border-emerald-100">
                      <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
                              <Badge className={statusConfig[appointment.status]?.color || ''}>
                                {statusConfig[appointment.status]?.icon}
                                {statusConfig[appointment.status]?.label || appointment.status}
                              </Badge>
                            </div>
                            <div className="grid sm:grid-cols-2 gap-2 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-emerald-600" />
                                {appointment.patientEmail}
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-emerald-600" />
                                {appointment.patientPhone}
                              </div>
                              <div className="flex items-center gap-2">
                                <CalendarIcon className="w-4 h-4 text-emerald-600" />
                                {format(new Date(appointment.date), 'MMMM d, yyyy')}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-emerald-600" />
                                {appointment.time}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Stethoscope className="w-4 h-4 text-emerald-600" />
                              <span className="font-medium">{getServiceName(appointment.service)}</span>
                            </div>
                            {appointment.message && (
                              <p className="text-sm text-gray-500 bg-gray-50 p-2 rounded">
                                <span className="font-medium">Note:</span> {appointment.message}
                              </p>
                            )}
                            <p className="text-xs text-gray-400">
                              Booked: {format(new Date(appointment.createdAt), 'MMM d, yyyy h:mm a')}
                            </p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Select
                              value={appointment.status}
                              onValueChange={(value) => handleStatusUpdate(appointment.id, value)}
                            >
                              <SelectTrigger className="w-40">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDelete(appointment.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-emerald-800">Dr. Sarah Mitchell</h1>
              <p className="text-sm text-emerald-600">Family & Cosmetic Dentistry</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <a href="tel:+15551234567" className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors">
              <Phone className="w-4 h-4" />
              (555) 123-4567
            </a>
            <a href="mailto:dr.mitchell@dentalcare.com" className="flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors">
              <Mail className="w-4 h-4" />
              dr.mitchell@dentalcare.com
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
                <Award className="w-4 h-4" />
                15+ Years of Experience
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Your Smile,{' '}
                <span className="text-emerald-600">Our Priority</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Welcome to Dr. Sarah Mitchell&apos;s dental practice, where we combine cutting-edge technology with compassionate care to give you the healthy, beautiful smile you deserve.
              </p>
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  Board Certified
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Heart className="w-5 h-5 text-emerald-600" />
                  Patient-Centered Care
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Modern Techniques
                </div>
              </div>
              <div className="flex items-center gap-4">
                <a href="#booking">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Book Appointment
                  </Button>
                </a>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-5 h-5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">500+ Reviews</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-emerald-100 to-teal-100 rounded-3xl flex items-center justify-center overflow-hidden">
                <div className="text-center p-8">
                  <div className="w-48 h-48 mx-auto bg-emerald-200 rounded-full flex items-center justify-center mb-6">
                    <User className="w-24 h-24 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-emerald-800">Dr. Sarah Mitchell</h3>
                  <p className="text-emerald-600">DDS, FAGD</p>
                  <p className="text-gray-600 mt-2">Fellow, Academy of General Dentistry</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-lg border border-emerald-100">
                <div className="text-center">
                  <p className="text-3xl font-bold text-emerald-600">15K+</p>
                  <p className="text-sm text-gray-600">Happy Patients</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive dental care for your entire family, from routine checkups to advanced procedures.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Card key={service.id} className="border-emerald-100 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group">
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors">
                    {service.name}
                  </CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-emerald-600">{service.price}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section id="booking" className="py-12 md:py-20 px-4 bg-gradient-to-b from-emerald-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Book Your Appointment</h2>
            <p className="text-lg text-gray-600">
              Schedule your visit today and take the first step towards a healthier smile.
            </p>
          </div>

          <Card className="border-emerald-100 shadow-xl">
            <CardContent className="p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-emerald-600" />
                    Personal Information
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Service Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-emerald-600" />
                    Select Service
                  </h3>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose a service" />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id}>
                          {service.name} - {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Date and Time */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5 text-emerald-600" />
                    Select Date & Time
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Preferred Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={`w-full justify-start text-left font-normal ${
                              !date && 'text-muted-foreground'
                            }`}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, 'PPP') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) =>
                              date < new Date() || date.getDay() === 0 || date.getDay() === 6
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Preferred Time *</Label>
                      <Select value={selectedTime} onValueChange={setSelectedTime}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                {time}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Message */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-emerald-600" />
                    Additional Information
                  </h3>
                  <Textarea
                    placeholder="Any specific concerns or questions? Let us know..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Booking...' : 'Book Appointment'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-12 md:py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Visit Us</h2>
            <p className="text-lg text-gray-600">
              We&apos;re conveniently located in the heart of downtown.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-emerald-100 text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Location</h3>
                <p className="text-gray-600">
                  123 Dental Street, Suite 100<br />
                  Medical District, MD 12345
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-100 text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Office Hours</h3>
                <p className="text-gray-600">
                  Mon - Fri: 9:00 AM - 5:00 PM<br />
                  Sat: 9:00 AM - 1:00 PM<br />
                  Sun: Closed
                </p>
              </CardContent>
            </Card>
            <Card className="border-emerald-100 text-center">
              <CardContent className="pt-6">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Contact</h3>
                <p className="text-gray-600">
                  Phone: (555) 123-4567<br />
                  Fax: (555) 123-4568<br />
                  Emergency: (555) 999-0000
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white py-8 px-4 mt-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">Dr. Sarah Mitchell</h3>
                  <p className="text-sm text-emerald-200">Family & Cosmetic Dentistry</p>
                </div>
              </div>
              <p className="text-emerald-200 text-sm">
                Providing exceptional dental care with a gentle touch for over 15 years.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-emerald-200">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#booking" className="hover:text-white transition-colors">Book Appointment</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Patient Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Insurance & Payments</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect With Us</h4>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/></svg>
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-emerald-700 pt-6 text-center text-sm text-emerald-200">
            <p>&copy; {new Date().getFullYear()} Dr. Sarah Mitchell Dental Practice. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
