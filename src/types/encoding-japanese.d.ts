declare module 'encoding-japanese' {
  interface ConvertOptions {
    to: string
    from: string
    type?: string
  }
  function detect(data: number[] | Uint8Array): string | false
  function convert(
    data: number[] | Uint8Array,
    options: ConvertOptions,
  ): string | number[]
  export { detect, convert }
  const Encoding: { detect: typeof detect; convert: typeof convert }
  export default Encoding
}
