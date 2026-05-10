import { type NextRequest, NextResponse } from "next/server"

export async function adminMiddleware(request: NextRequest) {
  // Con localStorage, la verificación de admin se hace en el cliente
  // Este middleware ya no es necesario
  return NextResponse.next()
}
