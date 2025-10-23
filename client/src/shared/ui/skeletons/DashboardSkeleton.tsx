// src/shared/ui/skeletons/DashboardSkeleton.tsx

const DashboardSkeleton = () => {
  return (
    <>
      <div>
        {/* Skeleton for AdminDatePicker */}
        <div className="animate-pulse">
          <div className="h-10 bg-gray-300 rounded dark:bg-gray-700" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">
            compared to previous period (loading...)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        {/* Left Section */}
        <div className="col-span-12 xl:col-span-8">
          {/* Skeleton for CardTraffic */}
          <div className="animate-pulse h-32 bg-gray-300 rounded dark:bg-gray-700" />

          {/* Skeleton for TrafficSessionChart */}
          <div className="animate-pulse h-64 mt-4 bg-gray-300 rounded dark:bg-gray-700" />

          {/* Skeleton for PieCharts */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5 mt-4">
            <div className="animate-pulse h-48 bg-gray-300 rounded dark:bg-gray-700" />
            <div className="animate-pulse h-48 bg-gray-300 rounded dark:bg-gray-700" />
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-12 xl:col-span-4">
          {/* Skeleton for TrafficPageChart */}
          <div className="animate-pulse h-64 bg-gray-300 rounded dark:bg-gray-700" />

          {/* Skeleton for TrafficSourceChart */}
          <div className="animate-pulse h-64 mt-4 bg-gray-300 rounded dark:bg-gray-700" />
        </div>

        {/* Full-Width Section */}
        <div className="col-span-12">
          {/* Skeleton for CountryTrafficMap */}
          <div className="animate-pulse h-96 bg-gray-300 rounded dark:bg-gray-700" />
        </div>
      </div>
    </>
  );
};

export default DashboardSkeleton;
