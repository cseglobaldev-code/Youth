import type { FormInstance } from 'antd';

/** Include preserved, unmounted wizard sections and uploads in a submission. */
export function preservedFormSnapshot<T>(form: Pick<FormInstance<T>, 'getFieldsValue'>): T {
  return form.getFieldsValue(true) as T;
}
