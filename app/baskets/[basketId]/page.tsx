import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ basketId: string }>
}

export default async function BasketDetailRedirect({ params }: Props) {
  const { basketId } = await params
  redirect(`/interview-templates/${basketId}`)
}
