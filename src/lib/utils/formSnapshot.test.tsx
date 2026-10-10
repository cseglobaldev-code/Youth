import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Form, Input } from 'antd';
import { useState } from 'react';
import { expect, it, vi } from 'vitest';
import { preservedFormSnapshot } from './formSnapshot';

it('includes earlier answers and document uploads when submitting an unmounted wizard section', async () => {
  const submitted = vi.fn();
  const assessment = {
    orgName: 'Organization', majorAchievements: 'Achievement', motivation: 'Motivation',
    youthEmpowerment: 'Vision', commitHours: true, declarationSignature: 'Applicant',
  };
  const documents = [{ uid: 'cv', name: 'portfolio.pdf' }];
  function Wizard() {
    const [form] = Form.useForm();
    const [section, setSection] = useState(1);
    return <Form form={form} initialValues={{ assessment, resumeCv: documents }}
      onFinish={(mounted) => submitted({ mounted, complete: preservedFormSnapshot(form) })}>
      {section === 1 ? <Form.Item name={['assessment', 'orgName']}><Input /></Form.Item>
        : <Form.Item name={['assessment', 'declarationSignature']}><Input /></Form.Item>}
      <button type="button" onClick={() => setSection(7)}>Declaration</button>
      <button type="button" onClick={() => form.submit()}>Submit</button>
    </Form>;
  }
  render(<Wizard />);
  fireEvent.click(screen.getByText('Declaration'));
  fireEvent.click(screen.getByText('Submit'));
  await waitFor(() => expect(submitted).toHaveBeenCalled());
  expect(submitted.mock.calls[0][0].mounted.assessment.orgName).toBeUndefined();
  expect(submitted.mock.calls[0][0].complete).toEqual({ assessment, resumeCv: documents });
});
