export function currentQueryState<T>(query: {
  data: T | undefined;
  isPending: boolean;
  isFetching: boolean;
  isError: boolean;
  isPlaceholderData: boolean;
}) {
  const isLoadingCurrentData = query.isPending || query.isFetching || query.isPlaceholderData;
  return {
    isLoadingCurrentData,
    data: isLoadingCurrentData || query.isError ? undefined : query.data,
  };
}
