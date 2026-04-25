import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ phaseSlug: string }>
}

export default async function PhaseRedirect({ params }: Props) {
  const { phaseSlug } = await params
  redirect(`/dotnet/phases/${phaseSlug}`)
}
