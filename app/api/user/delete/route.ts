import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
    }

    await prisma.post.deleteMany({
      where: { 
        user: { email: session.user.email } 
      }
    })

    await prisma.user.delete({
      where: { email: session.user.email }
    })

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error("Erro ao deletar conta:", error)
    return NextResponse.json(
      { message: "Erro ao excluir conta" },
      { status: 500 }
    )
  }
}