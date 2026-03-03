import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { patientName, patientEmail, patientPhone, service, date, time, message } = body

    // Validate required fields
    if (!patientName || !patientEmail || !patientPhone || !service || !date || !time) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(patientEmail)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Create appointment in database
    const appointment = await db.appointment.create({
      data: {
        patientName,
        patientEmail,
        patientPhone,
        service,
        date,
        time,
        message: message || null,
        status: 'pending',
      },
    })

    return NextResponse.json({
      success: true,
      appointment: {
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        service: appointment.service,
      },
    })
  } catch (error) {
    console.error('Error creating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Check authentication for viewing appointments
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in as admin.' },
      { status: 401 }
    )
  }

  try {
    const appointments = await db.appointment.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({ appointments })
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}
