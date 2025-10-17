import {
  useMutation,
  useQuery,
  UseQueryOptions,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { axiosApi } from "@/lib/axios";

type RecordType = Record<string, string | number | boolean | undefined>;

interface UseReadParameters<
  TData,
  TError,
  TParams extends Record<string, any> = Record<string, any>
> {
  queryKey?: (string | number)[];
  url: string;
  params?: TParams;
  options?: UseQueryOptions<TData, TError>;
}

export const useRead = <
  TData = unknown,
  TError = unknown,
  TParams extends Record<string, any> = Record<string, any>
>({
  queryKey,
  url,
  params,
  options,
}: UseReadParameters<TData, TError, TParams>) => {
  const queryFn = async (): Promise<TData> => {
    const response = await axiosApi.get(url, { params });
    return response.data;
  };

  queryKey = queryKey || [url];

  return useQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });
};

type Methods = "POST" | "PUT" | "PATCH" | "DELETE";

interface UseWriteParameters<TData, TError> {
  queryKey?: (string | number)[] | (string | number)[][];
  url: string;
  method?: Methods;
  data?: RecordType;
  params?: RecordType;
  options?: UseMutationOptions<TData, TError, unknown>;
  headers?: Record<string, string>;
}

export const useWrite = <TData = unknown, TError = unknown>({
  queryKey,
  url,
  method = "POST",
  data,
  params,
  options,
  headers,
}: UseWriteParameters<TData, TError>) => {
  const queryClient = useQueryClient();

  const mutationFn = async (variables: unknown) => {
    const payload = variables || data;
    const config = { params, headers };
    let response;

    switch (method) {
      case "POST":
        response = await axiosApi.post(url, payload, config);
        break;
      case "PUT":
        response = await axiosApi.put(url, payload, config);
        break;
      case "PATCH":
        response = await axiosApi.patch(url, payload, config);
        break;
      case "DELETE":
        response = await axiosApi.delete(url, payload);
        break;
      default:
        throw new Error("Invalid HTTP method");
    }
    return response.data;
  };

  const onInvalidateSuccess = () => {
    if (Array.isArray(queryKey?.[0])) {
      (queryKey as (string | number)[][]).forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    } else {
      queryClient.invalidateQueries({ queryKey });
    }
  };

  return useMutation({
    mutationFn,
    ...options,
    onSuccess: (data, variables, mutate, context) => {
      options?.onSuccess?.(data, variables, mutate, context);
      if (queryKey) {
        onInvalidateSuccess();
      }
    },
  });
};
