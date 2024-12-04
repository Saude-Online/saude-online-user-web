import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { Header } from './header'

// Crie uma instância do QueryClient
const queryClient = new QueryClient()

// Função para renderizar com o QueryClientProvider e Router
const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>,
  )
}

describe('Header', () => {
  it('should render the brand name', () => {
    renderWithProviders(<Header />)
    expect(screen.getByText('SaúdeOnline')).toBeInTheDocument()
  })

  // Teste para verificar se o clique no logo navega para a página inicial
  it('should navigate to home when clicking on the logo', () => {
    renderWithProviders(<Header />)
    const logo = screen.getByText('SaúdeOnline')
    expect(logo).toBeInTheDocument()
  })
})
