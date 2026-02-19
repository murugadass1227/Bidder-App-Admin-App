"use client";

import { useQuery } from "@tanstack/react-query";
import * as userApi from "./api";

export function useWonLots() {
  return useQuery({
    queryKey: ["won"],
    queryFn: userApi.getWonLots,
  });
}

export function useMyInvoices() {
  return useQuery({
    queryKey: ["invoices"],
    queryFn: userApi.getMyInvoices,
  });
}
