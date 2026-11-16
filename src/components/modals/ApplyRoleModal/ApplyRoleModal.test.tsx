import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import { describe, expect, it, vi } from 'vitest';
import { ApplyRoleModal } from './ApplyRoleModal';

function renderModal() {
  // jsdom never finishes antd leave animations, so removed upload rows would linger.
  return render(<ConfigProvider theme={{ token: { motion: false } }}><ApplyRoleModal open onClose={vi.fn()} /></ConfigProvider>);
}

async function selectPosition(position: string) {
  fireEvent.mouseDown(screen.getAllByRole('combobox')[0]);
  const options = await screen.findAllByTitle(position);
  fireEvent.click(options.at(-1)!);
  await waitFor(() => expect(screen.getAllByTitle(position).length).toBeGreaterThan(0));
}

const cvItem = () => screen.getByText('CV/Portfolio').closest('.ant-form-item') as HTMLElement;
// Let async rule validation settle before asserting the field shows no error.
const cvErrors = async () => {
  await new Promise(resolve => setTimeout(resolve, 50));
  return cvItem().querySelectorAll('.ant-form-item-explain-error');
};

function uploadCv(file: File) {
  fireEvent.change(cvItem().querySelector('input[type=file]')!, { target: { files: [file] } });
}

describe('ApplyRoleModal CV/Portfolio field', () => {
  it('is hidden before a position is selected and for Continental Director', async () => {
    renderModal();
    expect(screen.queryByText('CV/Portfolio')).not.toBeInTheDocument();
    await selectPosition('Continental Director');
    expect(screen.queryByText('CV/Portfolio')).not.toBeInTheDocument();
  });

  it.each(['Marketing & Communication Member', 'Secretary & Assistant'])(
    'appears right after Profile Photo for %s and is optional', async (position) => {
      renderModal();
      await selectPosition(position);
      const label = await screen.findByText('CV/Portfolio');
      const profileItem = screen.getByText('Profile Photo').closest('.ant-form-item')!;
      expect(profileItem.nextElementSibling).toBe(cvItem());
      expect(cvItem().nextElementSibling).toContainElement(screen.getByText('Activity Photos'));
      expect(label.parentElement).not.toHaveTextContent('*');
      expect(cvItem().querySelector('input[type=file]')).toHaveAttribute('accept', '.pdf,.doc,.docx');

      // Removing the only file re-validates the field; an empty CV must not raise an error.
      uploadCv(new File(['cv'], 'resume.pdf', { type: 'application/pdf' }));
      await within(cvItem()).findByText('resume.pdf');
      fireEvent.click(within(cvItem()).getByTitle('Remove file'));
      await waitFor(() => expect(within(cvItem()).queryByText('resume.pdf')).not.toBeInTheDocument());
      expect(await cvErrors()).toHaveLength(0);
    }
  );

  it('disappears and reappears as the position changes', async () => {
    renderModal();
    await selectPosition('Marketing & Communication Member');
    expect(await screen.findByText('CV/Portfolio')).toBeInTheDocument();
    await selectPosition('Continental Director');
    await waitFor(() => expect(screen.queryByText('CV/Portfolio')).not.toBeInTheDocument());
    await selectPosition('Secretary & Assistant');
    expect(await screen.findByText('CV/Portfolio')).toBeInTheDocument();
  });

  it('accepts a PDF, shows its name and replaces it with a newer file', async () => {
    renderModal();
    await selectPosition('Marketing & Communication Member');
    uploadCv(new File(['cv'], 'resume.pdf', { type: 'application/pdf' }));
    expect(await within(cvItem()).findByText('resume.pdf')).toBeInTheDocument();
    uploadCv(new File(['cv'], 'portfolio.docx'));
    expect(await within(cvItem()).findByText('portfolio.docx')).toBeInTheDocument();
    await waitFor(() => expect(within(cvItem()).queryByText('resume.pdf')).not.toBeInTheDocument());
    expect(await cvErrors()).toHaveLength(0);
  });

  it('rejects unsupported file types', async () => {
    renderModal();
    await selectPosition('Secretary & Assistant');
    uploadCv(new File(['<svg/>'], 'portfolio.svg', { type: 'image/svg+xml' }));
    expect(await within(cvItem()).findByText('Please upload a PDF, DOC or DOCX file')).toBeInTheDocument();
  });

  it('rejects files over 100 MB', async () => {
    renderModal();
    await selectPosition('Secretary & Assistant');
    const file = new File(['cv'], 'huge.pdf', { type: 'application/pdf' });
    Object.defineProperty(file, 'size', { value: 100 * 1024 * 1024 + 1 });
    uploadCv(file);
    expect(await within(cvItem()).findByText('File must be 100 MB or smaller')).toBeInTheDocument();
  });
});
