"use client";

export default function Stats({ provider, reviews, proposalData }: any) {
   
   const toPercentage = (rating: number) => {
    return Math.round((rating / 5) * 100);
  };

  const calculateRepeatClientPercentage = (
  proposals: any[]
) => {

  // Step 1 — Filter valid proposals
  const validProposals = proposals.filter(
    (proposal) =>
      proposal.status === "accepted" ||
      proposal.status === "completed"
  );

  // Step 2 — Count proposals per client
  const clientCount: Record<string, number> = {};

  validProposals.forEach((proposal) => {
    const clientId = proposal.clientId;

    if (clientCount[clientId]) {
      clientCount[clientId]++;
    } else {
      clientCount[clientId] = 1;
    }
  });

  // Step 3 — Get total unique clients
  const totalClients =
    Object.keys(clientCount).length;

  if (totalClients === 0) return 0;

  // Step 4 — Count repeat clients
  const repeatClients =
    Object.values(clientCount).filter(
      (count) => count > 1
    ).length;

  // Step 5 — Calculate percentage
  const percentage =
    (repeatClients / totalClients) * 100;

  return Number(percentage.toFixed(2));
};

const calculateYoYGrowth = (proposals: any[]) => {

  const currentYear = new Date().getFullYear();
  const previousYear = currentYear - 1;

  // Step 1 — Filter valid proposals
  const validProposals = proposals.filter(
    (proposal) =>
      proposal.status === "accepted" ||
      proposal.status === "completed"
  );

  // Step 2 — Count proposals per year
  let currentYearCount = 0;
  let previousYearCount = 0;

  validProposals.forEach((proposal) => {

    const year = new Date(
      proposal.createdAt
    ).getFullYear();

    if (year === currentYear) {
      currentYearCount++;
    }

    if (year === previousYear) {
      previousYearCount++;
    }

  });

  // Step 3 — Handle division by zero
  if (previousYearCount === 0) {
    return currentYearCount > 0 ? 100 : 0;
  }

  // Step 4 — Calculate growth
  const growth =
    ((currentYearCount - previousYearCount) /
      previousYearCount) *
    100;

  return Number(growth.toFixed(2));
};

  const stats = [
    {
      value: `${provider?.rating || 0} ★`,
      label: "Avg. rating",
      sub: `${provider?.reviewCount || reviews.length} verified reviews`,
    },
    {
      value: `${provider?.projectsCompleted || "N/A"}+`,
      label: "Projects delivered",
      sub: provider?.foundedYear
        ? `Since ${provider.foundedYear}`
        : "Since inception",
    },
    {
      value: calculateRepeatClientPercentage(proposalData).toFixed(2) + "%",
      label: "Repeat clients",
      sub: `↑ ${calculateYoYGrowth(proposalData).toFixed(2)} % YoY`,
    },
    // {
    //   value: `${provider?.teamSize || 34}`,
    //   label: "Team members",
    //   sub: "Professionals",
    // },
    // {
    //   value: "$2.4M",
    //   label: "Avg. client revenue lift",
    //   sub: "Per engagement",
    // },
    {
      value: `${toPercentage(provider?.communicationRating || 0)}%`,
      label: "On-time delivery",
      sub: "Last 3 years",
    },
    {
      value: `${new Date().getFullYear() - provider?.foundedYear || 0} yrs`,
      label: "In business",
      sub: `Founded ${provider?.foundedYear}`,
    },
  ];

 



  return (
    <section className="border-y bg-white px-6 sm:px-6 lg:px-0 py-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 justify-between divide-x divide-y md:divide-y-0">
        {stats.map((s, i) => (
          <div key={i} className="p-5">
            <h3 className="text-xl font-semibold">{s.value}</h3>
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-xs text-green-600">{s.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}