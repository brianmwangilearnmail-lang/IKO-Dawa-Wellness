// Mock Supabase client for now
export const supabase = {
  from: (table: string) => ({
    select: (columns?: string) => ({
      order: (column: string, options?: { ascending?: boolean }) => ({
        data: [],
        error: null
      })
    }),
    insert: (data: any) => ({
      data: null,
      error: null
    }),
    update: (data: any) => ({
      match: (filter: any) => ({
        data: null,
        error: null
      })
    }),
    delete: () => ({
      match: (filter: any) => ({
        data: null,
        error: null
      })
    })
  })
};
