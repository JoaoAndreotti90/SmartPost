import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { LandingPage } from "@/components/landing-page"
import { DashboardShell } from "@/components/dashboard-shell"

export default async function Home() {
  const session = await getServerSession(authOptions)

  if (!session || !session.user?.email) {
    return <LandingPage />
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user) {
    return <LandingPage /> 
  }

  return <DashboardShell user={user} />
}