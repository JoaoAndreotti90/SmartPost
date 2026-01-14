import { NextResponse } from "next/server"
import { hash } from "bcryptjs"
import { prisma } from "@/lib/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, password, name } = body

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    const userExists = await prisma.user.findUnique({
      where: { email }
    })

    if (userExists) {
      return NextResponse.json(
        { message: "Usuário já existe" },
        { status: 409 }
      )
    }

    const hashedPassword = await hash(password, 10)

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      }
    })

    const { password: newUserPassword, ...rest } = user

    return NextResponse.json(
      { user: rest, message: "Usuário criado com sucesso" },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: "Erro ao criar usuário" },
      { status: 500 }
    )
  }
}