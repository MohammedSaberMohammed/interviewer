import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ phaseSlug: string; lessonSlug: string }>
}

export default async function LessonRedirect({ params }: Props) {
  const { phaseSlug, lessonSlug } = await params
  redirect(`/dotnet/phases/${phaseSlug}/${lessonSlug}`)
}
