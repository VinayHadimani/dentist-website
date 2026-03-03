import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { isAuthenticated } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in as admin.' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params
    const body = await request.json()
    const { status } = body

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      )
    }

    const appointment = await db.appointment.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({ success: true, appointment })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { error: 'Failed to update appointment' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Check authentication
  const authenticated = await isAuthenticated()

  if (!authenticated) {
    return NextResponse.json(
      { error: 'Unauthorized. Please log in as admin.' },
      { status: 401 }
    )
  }

  try {
    const { id } = await params

    await db.appointment.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting appointment:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
