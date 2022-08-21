export default function RenderIf({
  children,
  condition,
}: {
  children: any
  condition: boolean
}) {
  return condition ? children : <></>
}
