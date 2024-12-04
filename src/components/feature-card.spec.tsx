import '@testing-library/jest-dom'

import { render, screen } from '@testing-library/react'
import { Home } from 'lucide-react'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'

import { FeatureCard } from './feature-card'

const mockProps = {
  icon: Home,
  title: 'Home Feature',
  description: 'This is a home feature description',
  to: '/home',
}

function renderFeatureCard() {
  return render(
    <BrowserRouter>
      <FeatureCard {...mockProps} />
    </BrowserRouter>,
  )
}

describe('FeatureCard', () => {
  // Teste para garantir que o componente renderiza corretamente com as props fornecidas
  it('should render correctly with provided props', () => {
    renderFeatureCard()

    // Teste para verificar se o título está sendo renderizado corretamente
    expect(screen.getByText(mockProps.title)).toBeInTheDocument()

    // Teste para verificar se a descrição está sendo renderizada corretamente
    expect(screen.getByText(mockProps.description)).toBeInTheDocument()

    // Teste para verificar se o link contém o título como atributo "title" e tem o destino correto
    const link = screen.getByTitle(mockProps.title)
    expect(link).toHaveAttribute('href', mockProps.to)
  })

  // Teste para garantir que o link do componente tenha o destino correto
  it('should have correct link destination', () => {
    renderFeatureCard()

    // Teste para verificar se o link do componente tem o destino correto
    const link = screen.getByTitle(mockProps.title)
    expect(link).toHaveAttribute('href', '/home')
  })
})
