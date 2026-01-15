import { render, screen } from '@testing-library/react'
import { LandingPage } from '@/components/landing-page' 

// Mocks
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => <a>{children}</a>
})

jest.mock('@/components/checkout-button', () => ({
  CheckoutButton: () => <button>Botão Fake</button>
}))

describe('Landing Page', () => {
  it('deve renderizar o título principal', () => {
    render(<LandingPage />)
    
    // Procura por "Crie posts" (parte do seu H1)
    const titulo = screen.getByText(/Crie posts/i) 
    
    expect(titulo).toBeInTheDocument()
  })

  it('deve ter um link de Entrar', () => {
    render(<LandingPage />)
    
    // CORREÇÃO: Em vez de procurar um "Botão", procuramos pelo TEXTO "Entrar"
    // O /i serve para ignorar se está maiúsculo ou minúsculo
    const linkEntrar = screen.getByText(/Entrar/i)
    
    expect(linkEntrar).toBeInTheDocument()
  })
})