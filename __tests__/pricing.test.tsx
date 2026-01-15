import { render, screen } from '@testing-library/react'
import PricingPage from '@/app/pricing/page'

jest.mock('@/components/checkout-button', () => ({
  CheckoutButton: () => <button>Comprar (Mock)</button>
}))

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return <a>{children}</a>
  }
})

describe('Página de Preços', () => {
  
  it('deve exibir o valor correto de R$ 19', () => {
    render(<PricingPage />)

    const preco = screen.getByText('R$ 19')

    expect(preco).toBeInTheDocument()
  })

  it('deve exibir o título do plano Iniciante', () => {
    render(<PricingPage />)

    const titulo = screen.getByText('Iniciante')
    expect(titulo).toBeInTheDocument()
  })

  it('deve mostrar que o plano Pro está em breve', () => {
    render(<PricingPage />)
    
    const botoesEmBreve = screen.getAllByText('Em Breve')
    
    expect(botoesEmBreve.length).toBeGreaterThan(0)
  })

})