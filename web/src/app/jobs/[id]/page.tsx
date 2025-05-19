export default async function JobDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="container mx-auto">
      Here will be details for job with id: {id}
    </div>
  );
}
