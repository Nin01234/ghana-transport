import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"

export function useSupabase() {
  const { toast } = useToast()

  const checkSupabase = () => {
    if (!supabase) {
      toast({
        title: "Service not configured",
        description: "Authentication service is not configured. Please contact support.",
        variant: "destructive",
      })
      return false
    }
    return true
  }

  return {
    supabase: supabase!, // Non-null assertion since we check before use
    checkSupabase,
    isConfigured: !!supabase,
  }
}
