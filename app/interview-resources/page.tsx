import ResourceCard from "./ResourceCard";

const getInterviewResources = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/interview-resources`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching interview resources:", error);
    return [];
  }
};

const InterviewResourcesPage = async () => {
  const resources = await getInterviewResources();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Interview Preparation Resources</h1>
      {resources.length === 0 ? (
        <p>No resources available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource: { id: any; title: any; description: any; link: any; }) => (
            <ResourceCard
              key={resource.id}
              title={resource.title}
              description={resource.description}
              link={resource.link}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewResourcesPage;
