export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ghana-green/10 via-ghana-gold/5 to-ghana-red/10">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-ghana-green border-t-transparent mx-auto"></div>
        <p className="text-lg font-medium text-muted-foreground">Verifying your email...</p>
      </div>
    </div>
  )
}
