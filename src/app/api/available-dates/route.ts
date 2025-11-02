export const runtime = 'nodejs';
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import AvailableDate from '@/models/AvailableDate'

// GET /api/available-dates - Public endpoint for fetching available dates
export async function GET(request: NextRequest) {
  try {
    await dbConnect()
    
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month')
    const year = searchParams.get('year')
    
    let query = {}
    
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1)
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59)
      query = {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    } else {
      // Default: get dates from today onwards
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      query = {
        date: { $gte: today }
      }
    }
    
    // Only return available dates (isAvailable: true)
    const availableDates = await AvailableDate.find({
      ...query,
      isAvailable: true
    })
      .sort({ date: 1 })
      .lean()
    
    return NextResponse.json({
      success: true,
      data: availableDates
    })
    
  } catch (error) {
    console.error('Error fetching available dates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch available dates' },
      { status: 500 }
    )
  }
}