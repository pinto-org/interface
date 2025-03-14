import { QueryKey } from "@tanstack/react-query";
import { useSetAtom } from "jotai";
import { atomWithImmer } from "jotai-immer";
import { useEffect } from "react";
import { FieldQueryKeys } from "../protocol/field";
import { SunQueryKeys } from "../protocol/sun";

type KnownQueryKeys = SunQueryKeys & FieldQueryKeys;

type ImmerAtom<T> = ReturnType<typeof atomWithImmer<T>>;

export default function useUpdateQueryKeys<T>(atom: ImmerAtom<T>, queryKey: QueryKey, key: keyof KnownQueryKeys) {
  const setQueryKey = useSetAtom(atom);

  useEffect(() => {
    setQueryKey((prev) => {
      prev[key] = queryKey;
    });
  }, [key, queryKey, setQueryKey]);
}
