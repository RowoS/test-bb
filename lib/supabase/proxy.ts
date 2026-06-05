import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

const PROTECTED_ROUTES = [
  '/vendor',
  '/customer',
  '/admin',
]

const AUTH_ONLY_ROUTES = [
  '/login',
  '/forgot-password',
]

const ROLE_SELECTION_ROUTE = '/sign-up/role-select'

const ROLE_DASHBOARDS: Record<string, string> = {
  vendor: '/vendor/dashboard',
  customer: '/customer',
  admin: '/admin/dashboard',
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const pathname = request.nextUrl.pathname

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthOnlyRoute = AUTH_ONLY_ROUTES.some((route) => pathname.startsWith(route))
  const isRoleSelectionRoute = pathname.startsWith(ROLE_SELECTION_ROUTE)

  const redirect = (path: string) => {
    const url = request.nextUrl.clone()
    url.pathname = path
    return NextResponse.redirect(url)
  }

  if (!user && (isProtectedRoute || isRoleSelectionRoute)) {
    return redirect('/login')
  }

  if (user) {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Profile fetch failed:', error)
      return redirect('/error')
    }

    const role = profile?.role
    const hasNoRole = !role || role === 'new'
    const dashboard = ROLE_DASHBOARDS[role] ?? null

    if (hasNoRole && !isRoleSelectionRoute) {
      return redirect(ROLE_SELECTION_ROUTE)
    }

    if (!hasNoRole && isRoleSelectionRoute) {
      return redirect(dashboard)
    }

    if (!hasNoRole && isAuthOnlyRoute) {
      return redirect(dashboard)
    }

    if (role === 'vendor' && pathname.startsWith('/customer')) {
      return redirect('/vendor/dashboard')
    }

    if (role === 'vendor' && pathname.startsWith('/admin')) {
      return redirect('/vendor/dashboard')
    }

    if (role === 'customer' && pathname.startsWith('/vendor')) {
      return redirect('/customer')
    }

    if (role === 'customer' && pathname.startsWith('/admin')) {
      return redirect('/customer')
    }

    if (role === 'admin' && pathname.startsWith('/vendor')) {
      return redirect('/admin/dashboard')
    }

    if (role === 'admin' && pathname.startsWith('/customer')) {
      return redirect('/admin/dashboard')
    }
  }

  return supabaseResponse
}