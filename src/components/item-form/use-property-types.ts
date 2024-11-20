import { getPropertyTypes } from "@/lib/data/sshoc/api/property";
import { useQuery } from "react-query";
import { keyBy } from "@acdh-oeaw/lib";

export function useGetPropertyTypes() {
  return useQuery({
    queryKey: ["property-types"] as const,
    async queryFn() {
      const data = await getPropertyTypes({ perpage: 100 });
      const propertyTypesById = keyBy(data.propertyTypes, (d) => d.code);
      return propertyTypesById;
    },
  });
}
