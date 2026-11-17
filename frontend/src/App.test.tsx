// Basic test: makes sure the App renders the brand name.
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App'

describe('App', () => {
  // Render App with the data provider it needs, then look for the heading.
  it('shows the brand name', () => {
    render(
      <QueryClientProvider client={new QueryClient()}>
        <App />
      </QueryClientProvider>,
    )
    expect(screen.getByRole('heading', { name: 'Nsoro' })).toBeInTheDocument()
  })
})
