"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteDocument,
  fetchDocuments,
  retryDocument,
  uploadDocument,
} from "../api/documentService";
import { OrgDocument } from "../types";

export function useDocuments() {
  const queryClient = useQueryClient();
  const { data = [], isLoading } = useQuery<OrgDocument[]>({
    queryKey: ["documents"],
    queryFn: fetchDocuments,
    staleTime: 0,
    refetchOnWindowFocus: false,
    refetchInterval: (query) =>
      query.state.data?.some((document) => document.status === "processing")
        ? 3000
        : false,
  });

  const invalidateDocuments = () => queryClient.invalidateQueries({ queryKey: ["documents"] });
  const uploadMutation = useMutation({ mutationFn: uploadDocument, onSuccess: invalidateDocuments });
  const deleteMutation = useMutation({ mutationFn: deleteDocument, onSuccess: invalidateDocuments });
  const retryMutation = useMutation({ mutationFn: retryDocument, onSuccess: invalidateDocuments });

  const uploadFiles = useCallback(
    async (files: File[]) => Promise.all(files.map((file) => uploadMutation.mutateAsync(file))),
    [uploadMutation]
  );

  return {
    documents: data,
    loading: isLoading,
    uploadFiles,
    deleteDoc: (id: string) => deleteMutation.mutateAsync(id),
    retryDoc: (id: string) => retryMutation.mutateAsync(id),
  };
}
