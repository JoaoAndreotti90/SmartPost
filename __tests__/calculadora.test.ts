describe('Calculadora Básica', () => {
  
  it('deve somar 2 + 2 e retornar 4', () => {
    const resultado = 2 + 2
    expect(resultado).toBe(4)
  })

  it('deve saber que 10 é maior que 5', () => {
    expect(10).toBeGreaterThan(5)
  })

})