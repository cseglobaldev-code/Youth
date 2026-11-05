import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ApplyRoleModal } from './ApplyRoleModal';

afterEach(cleanup);

async function choosePosition(position: string) {
  const input = document.querySelector('#position')!;
  fireEvent.mouseDown(input.closest('.ant-select')!.querySelector('.ant-select-selector') ?? input);
  await waitFor(() => {
    const option = [...document.querySelectorAll('.ant-select-item-option-content')].find(el => el.textContent === position);
    expect(option).toBeTruthy();
    fireEvent.click(option!);
  });
}

it.each(['Marketing & Communication Member', 'Secretary & Assistant'])(
  'places one optional CV upload immediately before Profile Photo for %s', async position => {
    render(<ApplyRoleModal open onClose={vi.fn()} />);
    await choosePosition(position);
    const label = await screen.findByText('CV/Portfolio', { exact: true });
    const field = label.closest('.ant-form-item')!;
    expect(field.nextElementSibling).toHaveTextContent('Profile Photo');
    expect(field).not.toHaveClass('ant-form-item-required');
    expect(field.querySelector('input[type="file"]')).not.toBeNull();
    expect(screen.getAllByText('CV/Portfolio', { exact: true })).toHaveLength(1);
    expect(label.parentElement?.closest('label')).not.toHaveClass('ant-form-item-required');
    await choosePosition('Continental Director');
    await waitFor(() => expect(screen.queryByText('CV/Portfolio', { exact: true })).not.toBeInTheDocument());
  }
);
