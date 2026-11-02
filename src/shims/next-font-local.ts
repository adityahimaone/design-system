export default function localFont(options?: { variable?: string; [key: string]: any }) {
  return {
    className: '',
    variable: options?.variable || '',
    style: {},
  }
}
