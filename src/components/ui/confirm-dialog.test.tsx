import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ConfirmDialog } from './confirm-dialog'

describe('ConfirmDialog', () => {
  it('calls onConfirm only after the user confirms, never on open', () => {
    const onConfirm = vi.fn()
    render(
      <ConfirmDialog open onOpenChange={() => {}} title="Удалить центр?" description="Это необратимо" onConfirm={onConfirm} />,
    )
    expect(onConfirm).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Удалить' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('does not render dialog content when closed', () => {
    render(<ConfirmDialog open={false} onOpenChange={() => {}} title="X" description="Y" onConfirm={() => {}} />)
    expect(screen.queryByText('X')).not.toBeInTheDocument()
  })
})
